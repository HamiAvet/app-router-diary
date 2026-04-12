import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { getAllExpiredEvents } from "@/app/lib/eventDataUtils";
import { getFcmTokenByUserId } from "@/app/lib/fcmDataUtils";

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
  const auth = request.headers.get("authorization");
  console.log(auth, process.env.CRON_SECRET);
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let usersList = [];
  const events = await getAllExpiredEvents();
  if (events || events.length !== 0) {
    
    events.forEach((event) => {
      if (!usersList.includes(event.userid)) {
        usersList.push(event.userid);
      }
    });
  }

  let fcmTokensList = [];
  for (const userId of usersList) {
    const fcmToken = await getFcmTokenByUserId(userId);
    if (fcmToken && fcmToken !== "null") {
      fcmTokensList.push(fcmToken);
    }
  }

  fcmTokensList.forEach(async (token, index) => {
    const payload = {
      token: token,
      notification: {
        title: "Event was expired",
        body: `Your event "${events[index].topic}" has expired.`,
      },
      webpush: {
        fcmOptions: {
          link: new URL("/diary", request.url).toString(),
        },
      },
    };
    try {
      await admin.messaging().send(payload);
    } catch (error) {
      console.error("Error sending notification:", error);
    }

  });

  return NextResponse.json({ auth: auth, secret: process.env.CRON_SECRET, date: new Date().toISOString(), events: events, usersList: usersList, fcmTokensList: fcmTokensList }, { status: 200 });

  /*if (events.length !== 0) {
    for (const event of events) {
      const fcmToken = await getFcmTokenByUserId(event.userid);

      if (fcmToken && fcmToken !== "null") {
        await fetch(new URL("/api/sendNotification", request.url), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: fcmToken,
            title: "Event was expired",
            message: `Your event "${event.topic}" has expired.`,
            link: "/diary", // You can include a link in the notification payload if needed
          }),
        });
      }
    }
  }*/
  
  
  /*const expected = process.env.CRON_SECRET?.trim();
  const auth = request.headers.get("authorization")?.trim();

  if (!expected || auth !== `Bearer ${expected}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const token = url.searchParams.get("token") ?? process.env.CRON_FCM_TOKEN;
  const title = url.searchParams.get("title") ?? "Notification";
  const body = url.searchParams.get("message") ?? `Cron ping: ${new Date().toISOString()}`;
  const linkParam = url.searchParams.get("link") ?? "/diary";

  if (!token) {
    return NextResponse.json(
      { ok: false, error: "Missing FCM token (use ?token=... or CRON_FCM_TOKEN)" },
      { status: 400 }
    );
  }

  const link = linkParam ? new URL(linkParam, request.url).toString() : undefined;

  const payload = {
    token,
    notification: {
      title,
      body,
    },
    webpush: link
      ? {
        fcmOptions: {
          link,
        },
      }
      : undefined,
  };

  try {
    const messageId = await admin.messaging().send(payload);
    return NextResponse.json({ ok: true, messageId, link }, { status: 200 });
  } catch (error) {
    const code = error?.code ?? error?.errorInfo?.code;
    const message = error?.message ?? "Unknown error";

    if (code === "messaging/registration-token-not-registered") {
      return NextResponse.json(
        { ok: false, error: "NotRegistered", code, message },
        { status: 410 }
      );
    }

    console.error("Error sending cron notification:", error);
    return NextResponse.json(
      { ok: false, error: "Send failed", code, message },
      { status: 500 }
    );
  }*/
  

    /*
    //////////////////////////////////////////////////////////
    const authHeader = request.headers.get("authorization");
    if (authHeader != `Bearer ${process.env.CRON_SECRET}`)
        return new Response("Unauthorized", {
        status: 401,
    });
    console.log(process.env.CRON_SECRET, new Date());
    return NextResponse.json({ message: `Cron Job Ran at ${new Date()}` }, { status: 200 });
    
    /////////////////////////////////////////////////////////
    const provided = request.headers.get("x-cron-secret");

    console.log({
      hasCronSecret: Boolean(process.env.CRON_SECRET),
      providedPresent: Boolean(provided),
      providedLength: provided?.length ?? 0,
    });
    
    if (!process.env.CRON_SECRET || provided !== process.env.CRON_SECRET) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }    
    
    return NextResponse.json({ provider: provided, key: process.env.CRON_SECRET, date: new Date().toISOString() }, { status: 200 });
    
    ////////////////////////////////////////////////////////////
    const provided = request.headers.get("x-cron-secret");


    return NextResponse.json({
      hasCronSecret: Boolean(process.env.CRON_SECRET),
      envLength: process.env.CRON_SECRET?.length ?? 0,
      providedPresent: Boolean(provided),
      providedLength: provided?.length ?? 0,
    });
    ////////////////////////////////////////////////////////////
  const auth = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ ok: true, message: `Cron Job Ran at ${new Date().toISOString()}` }, { status: 200 });
  //////////////////////////////////////////////////////////////

  // More secure version 

  const expected = process.env.CRON_SECRET?.trim();

  const auth = request.headers.get("authorization")?.trim();

  if (!expected || auth !== `Bearer ${expected}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ ok: true, ranAt: new Date().toISOString() }, { status: 200 });
  */
}