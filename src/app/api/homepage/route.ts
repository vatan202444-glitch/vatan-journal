import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/storage';
import { getHomepageSettings, type HomepageSettings } from '@/lib/data';
import { verifyAdminRequest, unauthorizedResponse } from '@/lib/auth';
import { persistCoverImage } from '@/lib/cover-image';

export async function GET() {
  try {
    const settings = getHomepageSettings();
    // Base64 coverni faylga o'tkazish
    if (settings.cover?.imageUrl?.startsWith('data:image')) {
      const imageUrl = persistCoverImage(settings.cover.imageUrl, 'homepage-cover', 'homepage');
      const updated: HomepageSettings = {
        ...settings,
        cover: { ...settings.cover, imageUrl },
      };
      writeData('homepage.json', updated);
      return NextResponse.json(updated);
    }
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch homepage' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!verifyAdminRequest(request)) return unauthorizedResponse();
  try {
    const body = (await request.json()) as HomepageSettings;
    const current = getHomepageSettings();

    // Cover rasmini base64'dan faylga o'tkazish
    let coverImageUrl = body.cover?.imageUrl ?? current.cover?.imageUrl ?? '';
    if (coverImageUrl.startsWith('data:image')) {
      coverImageUrl = persistCoverImage(coverImageUrl, 'homepage-cover', 'homepage');
    }

    const updated: HomepageSettings = {
      cover: {
        ...current.cover,
        ...body.cover,
        imageUrl: coverImageUrl,
      },
      featuredArticleId: body.featuredArticleId ?? current.featuredArticleId,
    };
    writeData('homepage.json', updated);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to save homepage' }, { status: 500 });
  }
}
