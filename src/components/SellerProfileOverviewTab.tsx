// components/SellerProfileOverviewTab.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clock, MessageCircle, Heart, Bookmark } from "lucide-react";

interface SellerProfileOverviewTabProps {
  // Assuming username would be passed as a prop for dynamic links
  username: string;
}

export default function SellerProfileOverviewTab({ username }: SellerProfileOverviewTabProps) {
  // Dummy data for counts - these would typically come from props or state
  const listingsCount = 2;
  const instantContentCount = 0;
  const photosCount = 1;
  const reviewsCount = 0;

  return (
    <div className="flex w-full mx-auto px-4 pt-4 pb-3 lg:pt-3">
      {/* Container for the overview section */}
      <div className="flex flex-col lg:flex-row">
        {/* Main content area, corresponds to col-lg-7 in Bootstrap */}
        <div className="w-full">
          {/* Shop Section Header and View All Button */}
          <div className="flex flex-wrap items-center justify-between mb-4">
            <div className="w-full lg:w-8/12">
              <h3 className="text-xl md:text-2xl font-bold text-slate-300">
                Shop <span className="text-sm text-violet-500">{listingsCount} Listings</span>
              </h3>
              <hr className="my-2 border-gray-700" />
            </div>
            <div className="w-full lg:w-4/12 flex justify-end">
              <Link href={`/profile/${username}?tab=shop`} className="w-full lg:w-auto">
                <Button variant="outline" size="sm" className="w-full mb-3 text-violet-400 border-violet-400 hover:bg-violet-900 hover:text-white">
                  View All Listings
                </Button>
              </Link>
            </div>
          </div>

          {/* Shop Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Listing Item 1 */}
            <div className="mb-4">
              <div className="shadow-md pb-2 animate rounded-lg bg-card-bg border border-gray-800">
                <div className="mb-3">
                  <div className="relative w-full aspect-video rounded-t-lg overflow-hidden">
                    <Link href="/listing/rose-panties-2">
                      <Image
                        loading="lazy"
                        className="object-cover"
                        src="/img/listings/rose-panties-21753279236-6880eb04bd327.jpeg"
                        alt="Rose Panties"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </Link>
                  </div>
                </div>
                <div className="px-3 relative -mt-8">
                  <div className="absolute top-0 left-3 -mt-6 z-10">
                    <Link href={`/profile/${username}`}>
                      <Image
                        className="rounded-[5px] shadow-sm"
                        alt="RosieGinger"
                        src="/img/users/rosieginger1752938943.png"
                        width={48}
                        height={48}
                      />
                    </Link>
                  </div>
                  <p className="text-sm mb-1 pt-6">
                    <Link href={`/profile/${username}`} className="text-violet-500 font-medium">
                      RosieGinger{" "}
                      <Image
                        className="rounded-[5px] inline-block ml-1"
                        src="/img/countries/us.png"
                        alt="US"
                        width={16}
                        height={16}
                      />
                    </Link>
                  </p>
                  <h6 className="text-base font-semibold text-slate-300">
                    <Link href="/listing/rose-panties-2">Rose Panties...</Link>
                  </h6>
                  <p className="text-sm text-gray-400 leading-tight mb-2">
                    What do you like?? Just let me know. I love to wear my satin panties while I...
                  </p>
                  <span className="absolute top-0 right-3">
                    <Bookmark className="float-right text-gray-500 hover:text-violet-500 cursor-pointer w-5 h-5" />
                  </span>
                  <div className="text-violet-500 mt-2">
                    <p className="font-bold text-xl">
                      15.00 <span className="text-sm">USD</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Listing Item 2 */}
            <div className="mb-4">
              <div className="shadow-md pb-2 animate rounded-lg bg-card-bg border border-gray-800">
                <div className="mb-3">
                  <div className="relative w-full aspect-video rounded-t-lg overflow-hidden">
                    <Link href="/listing/pink-panties-249">
                      <Image
                        loading="lazy"
                        className="object-cover"
                        src="/img/listings/pink-panties-2491753279101-6880ea7d38d02.jpeg"
                        alt="Pink Panties"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </Link>
                  </div>
                </div>
                <div className="px-3 relative -mt-8">
                  <div className="absolute top-0 left-3 -mt-6 z-10">
                    <Link href={`/profile/${username}`}>
                      <Image
                        className="rounded-[5px] shadow-sm"
                        alt="RosieGinger"
                        src="/img/users/rosieginger1752938943.png"
                        width={48}
                        height={48}
                      />
                    </Link>
                  </div>
                  <p className="text-sm mb-1 pt-6">
                    <Link href={`/profile/${username}`} className="text-violet-500 font-medium">
                      RosieGinger{" "}
                      <Image
                        className="rounded-[5px] inline-block ml-1"
                        src="/img/countries/us.png"
                        alt="US"
                        width={16}
                        height={16}
                      />
                    </Link>
                  </p>
                  <h6 className="text-base font-semibold text-slate-300">
                    <Link href="/listing/pink-panties-249">Pink Panties...</Link>
                  </h6>
                  <p className="text-sm text-gray-400 leading-tight mb-2">
                    Hi there! I’m excited to post my worn panties for you. Do you prefer me to...
                  </p>
                  <span className="absolute top-0 right-3">
                    <Bookmark className="float-right text-gray-500 hover:text-violet-500 cursor-pointer w-5 h-5" />
                  </span>
                  <div className="text-violet-500 mt-2">
                    <p className="font-bold text-xl">
                      15.00 <span className="text-sm">USD</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-4 border-gray-700" />

          {/* Photos Section Header and View All Button */}
          <div className="flex flex-wrap items-center justify-between mb-4">
            <div className="w-full lg:w-8/12">
              <h3 className="text-xl md:text-2xl font-bold text-slate-300">
                Photos <span className="text-sm text-violet-500">{photosCount} images</span>
              </h3>
              <hr className="my-2 border-gray-700" />
            </div>
            <div className="w-full lg:w-4/12 flex justify-end">
              <Link href={`/profile/${username}?tab=photos`} className="w-full lg:w-auto">
                <Button variant="outline" size="sm" className="w-full mb-3 text-violet-400 border-violet-400 hover:bg-violet-900 hover:text-white">
                  View All Images
                </Button>
              </Link>
            </div>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 px-0">
            {/* Photo Item 1 */}
            <div className="w-full px-1">
              <div className="relative aspect-square mb-2 shadow-sm rounded overflow-hidden">
                <Link href="/img/users/rosieginger1752938943.png" target="_blank" rel="noopener noreferrer">
                  <Image
                    loading="lazy"
                    className="object-cover rounded"
                    src="/img/users/rosieginger1752938943.png"
                    alt="rosieginger1752938943.png"
                    fill
                    sizes="(max-width: 768px) 33vw, 16vw"
                  />
                </Link>
              </div>
            </div>
          </div>

          <hr className="my-4 border-gray-700" />

          {/* Latest Activity Section */}
          <h3 className="text-xl md:text-2xl font-bold text-slate-300">Latest Activity</h3>
          <hr className="my-2 border-gray-700" />

          {/* Activity Item 1 */}
          <div className="flex mb-4 activity-item">
            <div className="w-1/12 md:w-1/12 pr-1">
              <div className="flex">
                <div className="w-full px-2 mb-2">
                  <div className="relative aspect-square rounded-[5px] overflow-hidden" title="RosieGinger">
                    <Link href={`/profile/${username}`} rel="nofollow">
                      <Image
                        loading="lazy"
                        className="shadow-sm rounded-[5px] object-cover"
                        src="/img/users/rosieginger1752938943.png"
                        alt="RosieGinger"
                        fill
                        sizes="64px"
                      />
                      <span className="absolute bottom-0 right-0 text-green-500 text-lg leading-none">●</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-11/12 md:w-11/12 pl-2">
              <p className="mb-0 text-slate-300">
                <Link href={`/profile/${username}`} className="text-violet-500 font-medium">RosieGinger</Link>
                <Image
                  className="rounded-[5px] inline-block ml-1"
                  src="/img/countries/us.png"
                  alt="US"
                  width={16}
                  height={16}
                />
              </p>
              <p className="text-sm text-gray-400 mb-0">
                Created a listing &gt;{" "}
                <Link href="/listing/rose-panties-2" target="_blank" className="text-violet-400 hover:underline">Rose Panties</Link>
              </p>
              <div className="flex flex-wrap">
                <div className="w-full md:w-4/12 flex-grow-0 flex-shrink-0">
                  <div className="relative aspect-video my-2 rounded overflow-hidden">
                    <Link href="/img/listings/rose-panties-21753279236-6880eb04bd327.jpeg" target="_blank" rel="noopener noreferrer">
                      <Image
                        src="/img/listings/rose-panties-21753279236-6880eb04bd327.jpeg"
                        alt="Rose Panties"
                        loading="lazy"
                        className="object-cover"
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="mt-1 mb-0 text-sm text-gray-400">
                <p className="float-right text-xs ml-3 mb-0 text-gray-500 flex items-center">
                  <Clock className="h-4 w-4 mr-1" /> 1m
                </p>
                <span className="cursor-pointer text-violet-400 hover:text-violet-500">
                  <span className="comments-count">0</span> <MessageCircle className="inline-block h-4 w-4 mr-1" />
                </span>{" "}
                <span className="mx-1 text-gray-600">|</span>
                <span className="cursor-pointer hidden text-violet-500">
                  <Heart className="inline-block h-4 w-4 mr-1 fill-current" />
                </span>
                <span className="cursor-pointer text-gray-500 hover:text-red-500">
                  <Heart className="inline-block h-4 w-4 mr-1" />
                </span>
                <span className="likes-count mr-2 text-violet-400">1</span>
                <Link href="/profile/princess02" title="Princess02" className="inline-block ml-1">
                  <Image
                    style={{ width: "18px", height: "18px" }}
                    loading="lazy"
                    className="rounded-[5px] object-cover"
                    src="/img/users/princess021745528987.jpeg"
                    alt="Princess02"
                    width={18}
                    height={18}
                  />
                </Link>
              </div>
              <div className="activity-comments hidden mt-2">
                <div className="py-3 mt-2 mb-1 border-b border-t border-gray-700">
                  <div className="bg-green-600/20 text-green-300 text-sm p-2 rounded mx-2 my-0">
                    <p className="mb-0">
                      Adding comments to the activity feed is a Premium Seller feature.{" "}
                      <Link href="/account/upgrade/premium" className="text-violet-400 hover:underline">
                        <svg xmlns="http://www.w3.org/2000/svg" className="inline-block h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-6h-2v6zm0-8h2V7h-2v2z"/></svg>
                        {" "}Go Premium &gt;
                      </Link>
                    </p>
                  </div>
                </div>
                <div className="comments-list"></div>
              </div>
            </div>
          </div>

          <hr className="my-4 border-slate-600/50" />

          {/* Activity Item 2 */}
          <div className="flex mb-4 activity-item">
            <div className="w-1/12 md:w-1/12 pr-1">
              <div className="flex">
                <div className="w-full px-2 mb-2">
                  <div className="relative aspect-square rounded-[5px] overflow-hidden" title="RosieGinger">
                    <Link href={`/profile/${username}`} rel="nofollow">
                      <Image
                        loading="lazy"
                        className="shadow-sm rounded-[5px] object-cover"
                        src="/img/users/rosieginger1752938943.png"
                        alt="RosieGinger"
                        fill
                        sizes="64px"
                      />
                      <span className="absolute bottom-0 right-0 text-green-500 text-lg leading-none">●</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-11/12 md:w-11/12 pl-2">
              <p className="mb-0 text-slate-300">
                <Link href={`/profile/${username}`} className="text-violet-500 font-medium">RosieGinger</Link>
                <Image
                  className="rounded-[5px] inline-block ml-1"
                  src="/img/countries/us.png"
                  alt="US"
                  width={16}
                  height={16}
                />
              </p>
              <p className="text-sm text-gray-400 mb-0">
                Created a listing &gt;{" "}
                <Link href="/listing/pink-panties-249" target="_blank" className="text-violet-400 hover:underline">Pink Panties</Link>
              </p>
              <div className="flex flex-wrap">
                <div className="w-full md:w-4/12 flex-grow-0 flex-shrink-0">
                  <div className="relative aspect-video my-2 rounded overflow-hidden">
                    <Link href="/img/listings/pink-panties-2491753279101-6880ea7d38d02.jpeg" target="_blank" rel="noopener noreferrer">
                      <Image
                        src="/img/listings/pink-panties-2491753279101-6880ea7d38d02.jpeg"
                        alt="Pink Panties"
                        loading="lazy"
                        className="object-cover"
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="mt-1 mb-0 text-sm text-gray-400">
                <p className="float-right text-xs ml-3 mb-0 text-gray-500 flex items-center">
                  <Clock className="h-4 w-4 mr-1" /> 3m
                </p>
                <span className="cursor-pointer text-violet-400 hover:text-violet-500">
                  <span className="comments-count">0</span> <MessageCircle className="inline-block h-4 w-4 mr-1" />
                </span>{" "}
                <span className="mx-1 text-gray-600">|</span>
                <span className="cursor-pointer hidden text-violet-500">
                  <Heart className="inline-block h-4 w-4 mr-1 fill-current" />
                </span>
                <span className="cursor-pointer text-gray-500 hover:text-red-500">
                  <Heart className="inline-block h-4 w-4 mr-1" />
                </span>
                <span className="likes-count mr-2 text-violet-400">3</span>
                <Link href="/profile/curvycarmen" title="CurvyCarmen" className="inline-block ml-1">
                  <Image
                    style={{ width: "18px", height: "18px" }}
                    loading="lazy"
                    className="rounded-[5px] object-cover"
                    src="/img/users/curvycarmen1751894147.jpeg"
                    alt="CurvyCarmen"
                    width={18}
                    height={18}
                  />
                </Link>
                <Link href="/profile/princess02" title="Princess02" className="inline-block ml-1">
                  <Image
                    style={{ width: "18px", height: "18px" }}
                    loading="lazy"
                    className="rounded-[5px] object-cover"
                    src="/img/users/princess021745528987.jpeg"
                    alt="Princess02"
                    width={18}
                    height={18}
                  />
                </Link>
                <Link href="/profile/xoxomissjenny" title="XoxoMissJenny" className="inline-block ml-1">
                  <Image
                    style={{ width: "18px", height: "18px" }}
                    loading="lazy"
                    className="rounded-[5px] object-cover"
                    src="/img/users/xoxomissjenny1751471248.jpeg"
                    alt="XoxoMissJenny"
                    width={18}
                    height={18}
                  />
                </Link>
              </div>
              <div className="activity-comments hidden mt-2">
                <div className="py-3 mt-2 mb-1 border-b border-t border-gray-700">
                  <div className="bg-green-600/20 text-green-300 text-sm p-2 rounded mx-2 my-0">
                    <p className="mb-0">
                      Adding comments to the activity feed is a Premium Seller feature.{" "}
                      <Link href="/account/upgrade/premium" className="text-violet-400 hover:underline">
                        <svg xmlns="http://www.w3.org/2000/svg" className="inline-block h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-6h-2v6zm0-8h2V7h-2v2z"/></svg>
                        {" "}Go Premium &gt;
                      </Link>
                    </p>
                  </div>
                </div>
                <div className="comments-list"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}