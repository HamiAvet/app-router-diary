import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { getAllEventsForCron, updateEventStatus } from "@/app/lib/eventDataUtils";
import {
  deleteFcmToken,
  getFcmTokenByUserId,
  updateFcmTokenByUserId,
} from "@/app/lib/fcmDataUtils";

export const runtime = "nodejs";

if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: privateKey,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  };
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export async function GET(request) {
  const expected = process.env.CRON_SECRET?.trim();
  const auth = request.headers.get("authorization")?.trim();

  if (!expected || auth !== `Bearer ${expected}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const ranAt = new Date();
  const now = new Date();

  let checked = 0;
  let expiredFound = 0;
  let notified = 0;
  let skippedNoToken = 0;
  let tokensDeleted = 0;
  let errors = 0;

  const isExpired = (event) => {
    const hour = event?.hour;
    const date = event?.date;

    if (!date) return false;

    if (!hour) {
      const dt = new Date(`${date}T23:59:00`);
      return Number.isFinite(dt.getTime()) && dt < now;
    }

    const hourStr = typeof hour === "string" ? hour.trim() : String(hour);
    const dt = hourStr.length === 5
      ? new Date(`${date}T${hourStr}:00`)
      : new Date(`${date}T${hourStr}`);

    return Number.isFinite(dt.getTime()) && dt < now;
  };

  try {
    const events = await getAllEventsForCron();

    if (!Array.isArray(events)) {
      return NextResponse.json(
        { ok: false, error: "Failed to load events" },
        { status: 500 }
      );
    }

    for (const event of events) {
      checked += 1;

      if (!isExpired(event)) continue;
      expiredFound += 1;

      const userId = event?.userid ?? event?.userId;
      if (!userId) {
        errors += 1;
        continue;
      }

      const token = await getFcmTokenByUserId(userId);
      if (!token || token === "null") {
        skippedNoToken += 1;
        continue;
      }

      const link = new URL("/diary", request.url).toString();
      const title = "Évènement expiré";
      const body = event?.topic
        ? `Ton évènement "${event.topic}" est expiré.`
        : "Un de tes évènements est expiré.";

      try {
        await admin.messaging().send({
          token,
          notification: { title, body },
          webpush: {
            fcmOptions: { link },
          },
        });

        await updateEventStatus({ id: event.id, status: "ExpiredNotified" });
        await updateFcmTokenByUserId(userId, token);
        notified += 1;
      } catch (err) {
        const code = err?.code ?? err?.errorInfo?.code;
        if (code === "messaging/registration-token-not-registered") {
          await deleteFcmToken(userId, token);
          tokensDeleted += 1;
          continue;
        }

        errors += 1;
        console.error("Cron notify error", {
          eventId: event?.id,
          userId,
          code,
          message: err?.message,
        });
      }
    }

    return NextResponse.json(
      {
        ok: true,
        ranAt: ranAt.toISOString(),
        checked,
        expiredFound,
        notified,
        skippedNoToken,
        tokensDeleted,
        errors,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Cron fatal error", err);
    return NextResponse.json(
      { ok: false, error: "Cron failed", message: err?.message },
      { status: 500 }
    );
  }
}