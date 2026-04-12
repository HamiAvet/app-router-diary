import { NextResponse } from "next/server";
import admin from "firebase-admin";

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
    /*const authHeader = request.headers.get("authorization");
    if (authHeader != `Bearer ${process.env.CRON_SECRET}`)
        return new Response("Unauthorized", {
        status: 401,
    });
    console.log(process.env.CRON_SECRET, new Date());
    return NextResponse.json({ message: `Cron Job Ran at ${new Date()}` }, { status: 200 });*/
    /*
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
    */

    /*const provided = request.headers.get("x-cron-secret");


    return NextResponse.json({
      hasCronSecret: Boolean(process.env.CRON_SECRET),
      envLength: process.env.CRON_SECRET?.length ?? 0,
      providedPresent: Boolean(provided),
      providedLength: provided?.length ?? 0,
    });*/

  const auth = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ ok: true, message: `Cron Job Ran at ${new Date().toISOString()}` }, { status: 200 });
  

    // More secure version 

  /*const expected = process.env.CRON_SECRET?.trim();
  const auth = request.headers.get("authorization")?.trim();

  if (!expected || auth !== `Bearer ${expected}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ ok: true, ranAt: new Date().toISOString() }, { status: 200 });
  */
}