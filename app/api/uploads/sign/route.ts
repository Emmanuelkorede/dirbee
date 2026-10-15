export async function POST() {
  return Response.json(
    { error: "Upload signing is not implemented yet." },
    { status: 501 },
  );
}