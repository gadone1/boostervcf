import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/mongodb';
import User from '../../../../../models/User';

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const version = Number(params.version);
    if (isNaN(version) || version <= 0) {
      return NextResponse.json({ message: 'Invalid version' }, { status: 400 });
    }

    const users = await User.find({ downloadVersion: version }).sort({ createdAt: -1 });
    if (users.length === 0) {
      return NextResponse.json({ message: 'No contacts found for this version' }, { status: 404 });
    }

    let vcfContent = '';
    users.forEach((user) => {
      vcfContent += `BEGIN:VCARD\n`;
      vcfContent += `VERSION:3.0\n`;
      vcfContent += `FN:${user.username}\n`;
      vcfContent += `TEL;TYPE=CELL:${user.phoneNumber}\n`;
      vcfContent += `END:VCARD\n\n`;
    });

    const res = new NextResponse(vcfContent, { status: 200 });
    res.headers.set('Content-Type', 'text/vcard');
    res.headers.set('Content-Disposition', `attachment; filename="contacts_v${version}.vcf"`);

    return res;
  } catch (error) {
    console.error('Error generating versioned VCF:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}