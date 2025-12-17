import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function uploadFile(
  file: File,
  folder: string = "uploads"
): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create unique filename
  const uniqueId = uuidv4();
  const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
  const filename = `${uniqueId}-${originalName}`;

  // Ensure directory exists
  const uploadDir = join(process.cwd(), "public", folder);
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (error) {
    // Ignore error if directory exists
  }

  // Save file
  const filepath = join(uploadDir, filename);
  await writeFile(filepath, buffer);

  // Return public URL
  return `/${folder}/${filename}`;
}
