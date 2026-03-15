import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';

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

    const user = new User({
      username: username.trim(),
      phoneNumber: normalizedPhone.trim(),
    });

    await user.save();

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
