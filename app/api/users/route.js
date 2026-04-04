import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import Counter from '../../../models/Counter';

const allowedCountryCodes = ['+250', '+256', '+254', '+255', '+257'];

const isValidPhone = (countryCode, value) => {
  if (!allowedCountryCodes.includes(countryCode)) return false;
  const digits = String(value).replace(/\D/g, '');
  return digits.length === 9;
};

export async function POST(request) {
  try {
    await dbConnect();

    const { username, countryCode = '', phoneNumber } = await request.json();

    if (!username || !phoneNumber) {
      return NextResponse.json({ message: 'Username and phone number are required' }, { status: 400 });
    }

    if (!isValidPhone(countryCode, phoneNumber)) {
      return NextResponse.json({
        message: 'Phone number must be 9 digits and country code must be a valid East Africa code',
      }, { status: 400 });
    }

    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    const normalizedPhone = `${countryCode}${cleanedPhone}`;

    // Prevent duplicate phone numbers
    const existing = await User.findOne({ phoneNumber: normalizedPhone.trim() });
    if (existing) {
      return NextResponse.json(
        { message: 'The phone number is already registered in the file.' },
        { status: 409 }
      );
    }

    const counterDoc = await Counter.findOne({ name: 'downloadVersion' });
    const nextVersion = counterDoc ? counterDoc.value + 1 : 1;

    const cleanName = username.trim().replace(/^V\d+\s*/i, '').trim();
    const versionedName = `V${nextVersion} ${cleanName}`;

    const user = new User({
      username: versionedName,
      phoneNumber: normalizedPhone.trim(),
      downloadVersion: 0,
    });

    await user.save();

    return NextResponse.json({ message: 'User created successfully', data: { username: versionedName } }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
