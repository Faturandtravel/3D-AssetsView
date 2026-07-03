// app/actions.js
"use server"

import { prisma } from '@/lib/db';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { revalidatePath } from 'next/cache';

// 1. ACTION: UPLOAD ASSET (.glb ke disk, path ke Postgres)
export async function uploadAsset(formData) {
  try {
    const file = formData.get('glbFile');
    const title = formData.get('title');

    if (!file || !title) throw new Error('Judul dan file wajib diisi!');
    if (!file.name.endsWith('.glb')) throw new Error('Format file harus berupa .glb');

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueFileName = `${Date.now()}-${file.name}`;
    const filePath = join(process.cwd(), 'public', 'uploads', uniqueFileName);

    await writeFile(filePath, buffer);
    const fileUrl = `/uploads/${uniqueFileName}`;

    await prisma.asset3D.create({
      data: { title, fileName: uniqueFileName, fileUrl },
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteAsset(id) {
  try {
    const asset = await prisma.asset3D.findUnique({ where: { id } });
    if (!asset) throw new Error('Asset tidak ditemukan');

    const filePath = join(process.cwd(), 'public', 'uploads', asset.fileName);
    try {
      await unlink(filePath);
    } catch (err) {
      console.log("File fisik tidak ditemukan, lanjut hapus baris DB");
    }

    await prisma.asset3D.delete({ where: { id } });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}