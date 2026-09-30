import { cookies } from "next/headers";
export async function sessionToken(){return (await cookies()).get("ftn_session")?.value ?? null}
