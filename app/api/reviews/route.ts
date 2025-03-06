import { NextResponse } from "next/server";
import ibm from "ibm-cos-sdk";
import { parse } from "csv-parse/sync";

const IBM_API_KEY_ID = process.env.IBM_COS_API_KEY_ID;
const IBM_SERVICE_INSTANCE_ID = process.env.IBM_COS_SERVICE_INSTANCE_ID;
const BUCKET_NAME = process.env.IBM_COS_BUCKET;
const ENDPOINT_URL = process.env.IBM_COS_ENDPOINT;

export async function GET() {
  try {
    if (!IBM_API_KEY_ID || !IBM_SERVICE_INSTANCE_ID || !BUCKET_NAME || !ENDPOINT_URL) {
      throw new Error("❌ Missing IBM Cloud Object Storage credentials.");
    }

    // ✅ Initialize IBM COS
    const cos = new ibm.S3({
      endpoint: ENDPOINT_URL,
      apiKeyId: IBM_API_KEY_ID,
      serviceInstanceId: IBM_SERVICE_INSTANCE_ID,
      signatureVersion: "iam",
      region: "us-south",
    });

    const FILE_NAME = "checkcsv.csv";

    // ✅ Fetch file from IBM COS
    const object = await cos.getObject({ Bucket: BUCKET_NAME, Key: FILE_NAME }).promise();

    if (!object.Body) {
      console.error("❌ ERROR: Object Body is missing.");
      return NextResponse.json({ error: "❌ File not found or empty." }, { status: 404 });
    }

    // ✅ Convert Buffer to String
    let csvData = object.Body.toString("utf-8");

    // ✅ Remove Byte Order Mark (BOM) if present
    csvData = csvData.replace(/^\uFEFF/, "");

    // ✅ Parse CSV into JSON
    const jsonData = parse(csvData, {
      columns: true, // Convert to JSON with column names as keys
      skip_empty_lines: true,
    });

    console.log("✅ Successfully Parsed JSON Data:", jsonData);

    return NextResponse.json(jsonData);
  } catch (error: unknown) {
    console.error("❌ Server Error:", error);
  
    let errorMessage = "Internal Server Error"; // Default message
  
    // ✅ Ensure error is an instance of Error before accessing `.message`
    if (error instanceof Error) {
      errorMessage = error.message;
    }
  
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
  
}
