// components/SellerProfileTopSection.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Loader2, Star, ShoppingBag, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

import { Database } from '@/lib/database.types';
import { Card } from './ui/card';
import { AspectRatio } from './ui/aspect-ratio';
import Image from 'next/image';
type ProfileRow = Database['public']['Tables']['profiles']['Row'];

interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  country?: string;
  is_premium_seller?: boolean;
  is_seller?: boolean;
  // Add other profile fields as needed
}

interface SellerProfileTopSectionProps {
  profile: Profile;
}

export default function SellerProfileTopSection({
  profile,
}: SellerProfileTopSectionProps) {
  const { user: currentUser, isLoading: authLoading } = useAuth();
  const [listingsCount, setListingsCount] = useState<number>(0);
  const [postsCount, setPostsCount] = useState<number>(0);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileAndCounts = async () => {
      setIsLoadingProfile(true);
      setError(null);

      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', profile.username)
          .single();

        if (profileError) {
          if (profileError.code === 'PGRST116') {
            throw new Error(
              `Profile for username "${profile.username}" not found.`
            );
          }
          throw profileError;
        }

        const { count: listingsTotal, error: listingsError } = await supabase
          .from('listings')
          .select('id', { count: 'exact' })
          .eq('seller_id', profileData.id);

        if (listingsError) {
          console.error('Error fetching listings count:', listingsError);
        } else {
          setListingsCount(listingsTotal || 0);
        }

        const { count: postsTotal, error: postsError } = await supabase
          .from('posts')
          .select('id', { count: 'exact' })
          .eq('user_id', profileData.id);

        if (postsError) {
          console.error('Error fetching posts count:', postsError);
        } else {
          setPostsCount(postsTotal || 0);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load profile data.');
        toast.error(err.message || 'Failed to load profile data.');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (profile.username && !authLoading) {
      // Added !authLoading condition
      fetchProfileAndCounts();
    }
  }, [profile.username, authLoading]); // Added authLoading to dependency array

  const isOwner = currentUser && profile && currentUser.id === profile.id;

  const getCountryFlagUrl = (countryCode: string | null) => {
    if (!countryCode) return 'https://placehold.co/64x64/E0E0E0/FFFFFF?text=NA';
    return `https://flagsapi.com/${countryCode.toUpperCase()}/flat/64.png`;
  };

  if (isLoadingProfile || authLoading) {
    return (
      <div className='flex justify-center items-center h-48 border-b'>
        <Loader2 className='h-8 w-8 animate-spin text-violet-500' />
        <p className='ml-2'>Loading profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className='border-b p-4 text-center text-red-400'>
        <p>Error: {error || 'Profile not found.'}</p>
      </div>
    );
  }

  return (
    <div className='w-full min-h-fit flex flex-col'>
      <div className='container w-full flex mx-auto px-4 py-4 md:py-6 lg:py-8'>
        <div className='w-full flex'>
          <div className='w-2/5 mr-5 flex justify-center lg:justify-start'>
            <div className='w-full h-full lg:relative lg:h-full rounded-[5px] overflow-clip shadow-md'>
              <AspectRatio ratio={1}>
                <Image
                  src={profile.avatar_url || '/images/default-avatar.png'}
                  alt={profile.username || 'User Avatar'}
                  fill
                  className="profile-picture"
                />
              </AspectRatio>
            </div>
          </div>
          <div className='w-4/5 ml-5 flex shadow-sm'>
            <Card className='w-full bg-card-bg w-full h-fit flex-col justify-center border p-5'>
              <p className='text-base font-semibold text-violet-600'>
                {profile.is_premium_seller
                  ? 'Premium Seller'
                  : profile.is_seller
                  ? 'Seller'
                  : 'Buyer'}
              </p>
              <h1 className='inline-block text-2xl md:text-3xl font-bold text-slate-300'>
                {profile.username}
              </h1>
              

              <p className='mb-3 mt-0 text-sm text-gray-400 flex items-center'>
                <span
                  className='flex items-center mr-2'
                  title='Review Rating'>
                  <Star className='h-4 w-4 text-yellow-500 mr-1' /> -
                </span>
                {profile.country && (
                  <span className='flex items-center'>
                    <Image
                      className='rounded-full mr-1'
                      src={getCountryFlagUrl(profile.country)}
                      alt={profile.country}
                      width={20}
                      height={20}
                    />
                    {countries.find((c) => c.value === profile.country)
                      ?.label || profile.country}
                  </span>
                )}
              </p>

              {isOwner && (
                <Link href='/settings className="w-full flex flex-col justify-center items-center m-auto'>
                  <Button className='w-1/4 flex justify-center border-2 border-violet-600 text-violet-600'>Edit Profile</Button>
                </Link>
              )}

              <hr className='border' />

              <ul className='flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-300'>
                <li className='flex items-center'>
                  <Link
                    href={`/profile/${profile.username}?tab=shop`}
                    className='flex items-center hover:text-violet-500 transition-colors'>
                    <ShoppingBag className='h-4 w-4 mr-1 svg-color' /> {listingsCount}{' '}
                    Listing{listingsCount !== 1 ? 's' : ''}
                  </Link>
                </li>
                <li className='flex items-center'>
                  <Link
                    href={`/profile/${profile.username}?tab=instant`}
                    className='flex items-center hover:text-violet-500 transition-colors'>
                    <Camera className='h-4 w-4 mr-1 svg-color' /> {postsCount} Instant
                    Content
                  </Link>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dummy data for countries (should ideally be imported or fetched)
const countries = [
  { value: 'US', label: 'United States' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'NZ', label: 'New Zealand' },
  { value: 'DE', label: 'Germany' },
  { value: 'IE', label: 'Ireland' },
  { value: 'IT', label: 'Italy' },
  { value: 'ES', label: 'Spain' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'FR', label: 'France' },
  { value: 'SE', label: 'Sweden' },
  { value: 'NO', label: 'Norway' },
  { value: 'DK', label: 'Denmark' },
  { value: 'CH', label: 'Switzerland' },
  { value: 'AT', label: 'Austria' },
  { value: 'BE', label: 'Belgium' },
  { value: 'FI', label: 'Finland' },
  { value: 'GR', label: 'Greece' },
  { value: 'PT', label: 'Portugal' },
  { value: 'JP', label: 'Japan' },
  { value: 'MX', label: 'Mexico' },
  { value: 'BR', label: 'Brazil' },
  { value: 'AR', label: 'Argentina' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'SG', label: 'Singapore' },
  { value: 'HK', label: 'Hong Kong' },
];
