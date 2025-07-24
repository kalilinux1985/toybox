// components/SellerProfileDetails.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Venus } from "lucide-react"; // Importing icons

import { Database } from "@/lib/database.types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import SellerProfileOverviewTab from "./SellerProfileOverviewTab";
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

interface SellerProfileDetailsProps {
  profile: ProfileRow;
  listingsCount: number; // Prop for listings count
  postsCount: number; // Prop for posts count
}

export default function SellerProfileDetails({
  profile,
  listingsCount,
  postsCount,
}: SellerProfileDetailsProps) {
  const [showMoreAttributes, setShowMoreAttributes] = useState(false);

  const toggleProfileAttributes = () => {
    setShowMoreAttributes(!showMoreAttributes);
  };

  // Helper to render profile attributes, handles nulls and provides default text
  const renderAttribute = (label: string, value: string | null | undefined, linkPrefix?: string, icon?: React.ReactNode) => {
    if (!value) return null; // Don't render if value is null or undefined

    // Basic mapping for common database values to more readable text
    let displayValue = value;
    if (label === "Ethnicity") {
      switch (value) {
        case "C": displayValue = "Caucasian (White)"; break;
        // Add more cases for other ethnicity codes if known
        default: break;
      }
    } else if (label === "Body Size") {
      switch (value) {
        case "C": displayValue = "Curvy"; break;
        // Add more cases for other body size codes if known
        default: break;
      }
    }


    return (
      <p className='mb-2 text-slate-300'>
        {label}:
        <span className='float-right'>
          {icon && <span className="inline-flex items-center justify-center">{icon}</span>}
          {linkPrefix ? (
            <Link
              href={`${linkPrefix}${value}`}
              className='text-violet-500 hover:underline'>
              {displayValue}
            </Link>
          ) : (
            displayValue
          )}
        </span>
      </p>
    );
  };

  // Calculate joined date
  const joinedDate = profile.created_at ? new Date(profile.created_at) : null;
  const now = new Date();
  let monthsSinceJoined: number | null = null;
  if (joinedDate) {
    const diffTime = Math.abs(now.getTime() - joinedDate.getTime());
    monthsSinceJoined = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44)); // Average days in a month
  }


  return (
    <div className='container mx-auto px-4 py-1 pb-3'>
      <div className='flex flex-col lg:flex-row gap-6'>
        {/* Left Column - About Section and Attributes */}
        <div className='w-full lg:w-2/5 p-4 bg-card-bg border shadow-sm'>
          {/* Mobile Tabs */}
          <ul className='lg:hidden flex flex-wrap -mb-px text-sm font-medium text-center bg-card-bg'>
            <li className='me-2'>
              <Link
                href={`/profile/${profile.username}`}
                className='inline-block p-4 text-violet-500 border-b-2 border-violet-500 hover:border-violet-600 rounded-t-[5px] active:text-slate-200 active:bg-violet-600 hover:bg-violet-600/30'>
                Overview
              </Link>
            </li>
            <li className='me-2'>
              <Link
                href={`/profile/${profile.username}?tab=shop`}
                className='inline-block p-4 border-b-2  hover:border-violet-600 rounded-t-[5px] text-slate-200 hover:text-violet-600 focus:bg-violet-600/30'
                title={`${listingsCount} Listings`}>
                Shop
              </Link>
            </li>
            <li className='me-2'>
              <Link
                href={`/profile/${profile.username}?tab=instant`}
                className='inline-block p-4 border-b-2 border-transparent rounded-t-lg text-slate-200 hover:text-gray-300 hover:border-gray-300'
                title={`${postsCount} Items`}>
                Instant Content
              </Link>
            </li>
            <li className='me-2'>
              <Link
                href={`/profile/${profile.username}?tab=photos`}
                className='inline-block p-4 border-b-2 border-transparent rounded-t-lg text-slate-200 hover:text-gray-300 hover:border-gray-300'
                title='0 Photos'>
                Photos
              </Link>
            </li>
            <li className='me-2'>
              <Link
                href={`/profile/${profile.username}?tab=reviews`}
                className='inline-block p-4 border-b-2 border-transparent rounded-t-lg text-slate-200 hover:text-gray-300 hover:border-gray-300'
                title='0 Reviews'>
                Reviews
              </Link>
            </li>
          </ul>

          <div className='text-slate-200 p-3'>
            <h3 className='text-slate-300'>
              <span className='text-violet-600'>About</span> {profile.username}
            </h3>
            <p className='w-full text-center text-sm mt-3'>
              <Link
                className='font-light hover:underline'
                href={`/profile/${profile.username}?tab=followers`}>
                <span className='text-violet-500 font-bold'>0</span> Followers
              </Link>
              &nbsp;-&nbsp;
              <Link
                className='font-light hover:underline'
                href={`/profile/${profile.username}?tab=following`}>
                <span className='text-violet-500 font-bold'>0</span> Following
              </Link>
              &nbsp;-&nbsp;
              <Link
                className='font-light hover:underline'
                href={`/profile/${profile.username}?tab=badges`}>
                <span className='text-violet-500 font-bold'>2</span> Badges
              </Link>
            </p>
          </div>
          <hr className='mx-3 border-gray-700' />

          <div className="p-3">
            {renderAttribute("Gender", profile.gender, `/members/sellers?gender=`, <Venus className="h-4 w-4 text-violet-500" />)}
            {renderAttribute("Age", profile.age, `/members/sellers?age=`)}

            <div className='profile-attributes-toggle mb-2 pb-2 border-b border-gray-700'>
              <p
                className='mb-2 cursor-pointer text-violet-500 flex items-center justify-between'
                onClick={toggleProfileAttributes}>
                <span id='toggle-text'>{showMoreAttributes ? "Less" : "More"}</span>
                {showMoreAttributes ? (
                  <ChevronUp className='h-4 w-4 text-violet-500' id='toggle-icon' />
                ) : (
                  <ChevronDown className='h-4 w-4 text-violet-500' id='toggle-icon' />
                )}
              </p>
            </div>

            {showMoreAttributes && (
              <div className='profile-attributes-content' id='profile-attributes'>
                {renderAttribute("Ethnicity", profile.ethnicity, `/members/sellers?ethnicity=`)}
                {renderAttribute("Body Size", profile.body_size, `/members/sellers?size=`)}
                {renderAttribute("Eye Color", profile.eye_color, `/members/sellers?eye_color=`)}
                {renderAttribute("Hair Color", profile.hair_color, `/members/sellers?hair_color=`)}
                {renderAttribute("Height", profile.height, `/members/sellers?height=`)}
                {renderAttribute("Occupation", profile.occupation, `/members/sellers?occupation=`)}
                {renderAttribute("Relationship Status", profile.relationship_status, `/members/sellers?relationship_status=`)}
                {renderAttribute("Piercings", profile.piercings, `/members/sellers?piercings=`)}
                {renderAttribute("Tattoos", profile.tattoos, `/members/sellers?tattoos=`)}
                {renderAttribute("Smokes", profile.smokes, `/members/sellers?smokes=`)}
                {renderAttribute("Drinks", profile.drinks, `/members/sellers?drinks=`)}
                {renderAttribute("Shoe Size", profile.shoe_size, `/members/sellers?shoe_size=`)}
                {profile.will_show_face !== null && (
                  <p className='mb-2 text-gray-300'>
                    Will Show Face:
                    <span className='float-right'>
                      <Link href={`/members/sellers?will_show_face=${profile.will_show_face ? 'yes' : 'no'}`} className="text-violet-500 hover:underline">
                        {profile.will_show_face ? "Yes" : "No"}
                      </Link>
                    </span>
                  </p>
                )}
              </div>
            )}
            <p className='mb-2 text-gray-300'>
              Joined:
              <span className='float-right'>
                {monthsSinceJoined !== null ? `${monthsSinceJoined} months ago` : "N/A"}
              </span>
            </p>
            {/* Profile visits is not in the schema, using a static value for now */}
            <p className='mb-2 text-gray-300'>
              Profile Visits:
              <span className='float-right'>251</span>
            </p>
          </div>
        </div>

        <Tabs defaultValue="Overview" className="w-4/5">
          <TabsList className="bg-card-bg p-2.5 h-auto w-full flex justify-around">
            <TabsTrigger className="border-0 hover:bg-violet-600/30 text-slate-200 hover:border-b-2 rounded-[2px] hover:border-b-violet-500/60 focus:bg-violet-600" value="Overview">Overview</TabsTrigger>
            <TabsTrigger className="border-0 hover:bg-violet-600/30 text-slate-200 hover:border-b-2 rounded-[2px] hover:border-b-violet-500/60 focus:bg-violet-600" value="Shop">Shop</TabsTrigger>
            <TabsTrigger className="border-0 hover:bg-violet-600/30 text-slate-200 hover:border-b-2 rounded-[2px] hover:border-b-violet-500/60 focus:bg-violet-600" value="Instant Content">Instant Content</TabsTrigger>
            <TabsTrigger className="border-0 hover:bg-violet-600/30 text-slate-200 hover:border-b-2 rounded-[2px] hover:border-b-violet-500/60 focus:bg-violet-600" value="Photos">Photos</TabsTrigger>
            <TabsTrigger className="border-0 hover:bg-violet-600/30 text-slate-200 hover:border-b-2 rounded-[2px] hover:border-b-violet-500/60 focus:bg-violet-600" value="Reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="Overview" className="w-full flex">
            <SellerProfileOverviewTab username={profile.username || ''} />
          </TabsContent>
          <TabsContent value="Shop">Listings will go here.</TabsContent>
          <TabsContent value="Instant Content">Instant Content will go here.</TabsContent>
          <TabsContent value="Photos">Photos will go here.</TabsContent>
          <TabsContent value="Reviews">Reviews will go here.</TabsContent>
        </Tabs>

        {/* Right Column - Shop and Instant Content Sections */}
        {/* <div className='w-full lg:w-3/5 flex flex-col gap-6'>
          
          <ul className='hidden lg:flex flex-wrap -mb-px text-sm font-medium text-center border-b border-gray-700 bg-card-bg p-2 rounded-lg shadow-sm'>
            <li className='me-2'>
              <Link
                href={`/profile/${profile.username}?tab=overview`}
                className='inline-block p-4 text-violet-500 border-b-2 border-violet-500 rounded-t-lg active:text-slate-200 active:bg-violet-600 hover:bg-violet-600/30'>
                Overview
              </Link>
            </li>
            <li className='me-2'>
              <Link
                href={`/profile/${profile.username}?tab=shop`}
                className='inline-block p-4 border-b-2 border-transparent rounded-t-lg text-slate-200 hover:text-gray-300 hover:border-gray-300'
                title={`${listingsCount} Listings`}>
                Shop
              </Link>
            </li>
            <li className='me-2'>
              <Link
                href={`/profile/${profile.username}?tab=instant`}
                className='inline-block p-4 border-b-2 border-transparent rounded-t-lg text-slate-200 hover:text-gray-300 hover:border-gray-300'
                title={`${postsCount} Items`}>
                Instant Content
              </Link>
            </li>
            <li className='me-2'>
              <Link
                href={`/profile/${profile.username}?tab=photos`}
                className='inline-block p-4 border-b-2 border-transparent rounded-t-lg text-slate-200 hover:text-gray-300 hover:border-gray-300'
                title='0 Photos'>
                Photos
              </Link>
            </li>
            <li className='me-2'>
              <Link
                href={`/profile/${profile.username}?tab=reviews`}
                className='inline-block p-4 border-b-2 border-transparent rounded-t-lg text-slate-200 hover:text-gray-300 hover:border-gray-300'
                title='0 Reviews'>
                Reviews
              </Link>
            </li>
          </ul>

         
          <div className='bg-card-bg border rounded-lg shadow-sm p-4'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-slate-200 text-xl font-semibold'>
                Shop <span className='text-sm text-violet-600'>{listingsCount} Listing{listingsCount !== 1 ? "s" : ""}</span>
              </h3>
              <Link
                className='btn bg-violet-600 hover:bg-violet-700 text-white py-2 px-4 rounded-md text-sm'
                href={`/profile/${profile.username}?tab=shop`}>
                View All Listings
              </Link>
            </div>
            <div className='alert alert-info border border-blue-500 bg-blue-100 text-blue-800 p-3 rounded-md text-sm'>
              No listings
            </div>
          </div>

          
          <div className='bg-card-bg border rounded-lg shadow-sm p-4'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-slate-200 text-xl font-semibold'>
                Instant Content <span className='text-sm text-violet-600'>{postsCount} Item{postsCount !== 1 ? "s" : ""}</span>
              </h3>
              <Link
                className='btn bg-violet-600 hover:bg-violet-700 text-white py-2 px-4 rounded-md text-sm'
                href={`/profile/${profile.username}?tab=instant`}>
                View All Content
              </Link>
            </div>
            <div className='alert alert-info border border-blue-500 bg-blue-100 text-blue-800 p-3 rounded-md text-sm'>
              No instant content available.
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}