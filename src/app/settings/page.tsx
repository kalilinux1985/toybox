"use client";

import React, { useState, useRef, useEffect } from "react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
	CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
	ChevronDown,
	ChevronUp,
	Image as ImageIcon,
	Trash2,
	Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext"; // Ensure this path is correct based on your project structure
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";


import { Profile } from "@/types"; // Import Profile type

// --- ALL PROVIDED CONST ARRAYS ---
const countries = [
	{ value: "US", label: "United States" },
	{ value: "UK", label: "United Kingdom" },
	{ value: "CA", label: "Canada" },
	{ value: "AU", label: "Australia" },
	{ value: "NZ", label: "New Zealand" },
	{ value: "DE", label: "Germany" },
	{ value: "IE", label: "Ireland" },
	{ value: "IT", label: "Italy" },
	{ value: "ES", label: "Spain" },
	{ value: "NL", label: "Netherlands" },
	{ value: "FR", label: "France" },
	{ value: "ZA", label: "South Africa" },
	{ value: "PT", label: "Portugal" },
	{ value: "OT", label: "Other" },
	{ value: "AF", label: "Afghanistan" },
	{ value: "AL", label: "Albania" },
	{ value: "DZ", label: "Algeria" },
	{ value: "AS", label: "American Samoa" },
	{ value: "AD", label: "Andorra" },
	{ value: "AO", label: "Angola" },
	{ value: "AI", label: "Anguilla" },
	{ value: "AQ", label: "Antarctica" },
	{ value: "AG", label: "Antigua and Barbuda" },
	{ value: "AR", label: "Argentina" },
	{ value: "AM", label: "Armenia" },
	{ value: "AW", label: "Aruba" },
	{ value: "AT", label: "Austria" },
	{ value: "AZ", label: "Azerbaijan" },
	{ value: "BS", label: "Bahamas" },
	{ value: "BH", label: "Bahrain" },
	{ value: "BD", label: "Bangladesh" },
	{ value: "BB", label: "Barbados" },
	{ value: "BY", label: "Belarus" },
	{ value: "BE", label: "Belgium" },
	{ value: "BZ", label: "Belize" },
	{ value: "BJ", label: "Benin" },
	{ value: "BM", label: "Bermuda" },
	{ value: "BT", label: "Bhutan" },
	{ value: "BO", label: "Bolivia" },
	{ value: "BA", label: "Bosnia and Herzegovina" },
	{ value: "BW", label: "Botswana" },
	{ value: "BV", label: "Bouvet Island" },
	{ value: "BR", label: "Brazil" },
	{ value: "BQ", label: "British Antarctic Territory" },
	{ value: "IO", label: "British Indian Ocean Territory" },
	{ value: "VG", label: "British Virgin Islands" },
	{ value: "BN", label: "Brunei" },
	{ value: "BG", label: "Bulgaria" },
	{ value: "BF", label: "Burkina Faso" },
	{ value: "BI", label: "Burundi" },
	{ value: "KH", label: "Cambodia" },
	{ value: "CM", label: "Cameroon" },
	{ value: "CT", label: "Canton and Enderbury Islands" },
	{ value: "CV", label: "Cape Verde" },
	{ value: "KY", label: "Cayman Islands" },
	{ value: "CF", label: "Central African Republic" },
	{ value: "TD", label: "Chad" },
	{ value: "CL", label: "Chile" },
	{ value: "CN", label: "China" },
	{ value: "CX", label: "Christmas Island" },
	{ value: "CC", label: "Cocos [Keeling] Islands" },
	{ value: "CO", label: "Colombia" },
	{ value: "KM", label: "Comoros" },
	{ value: "CG", label: "Congo - Brazzaville" },
	{ value: "CD", label: "Congo - Kinshasa" },
	{ value: "CK", label: "Cook Islands" },
	{ value: "CR", label: "Costa Rica" },
	{ value: "HR", label: "Croatia" },
	{ value: "CU", label: "Cuba" },
	{ value: "CY", label: "Cyprus" },
	{ value: "CZ", label: "Czech Republic" },
	{ value: "CI", label: "Côte d'Ivoire" },
	{ value: "DK", label: "Denmark" },
	{ value: "DJ", label: "Djibouti" },
	{ value: "DM", label: "Dominica" },
	{ value: "DO", label: "Dominican Republic" },
	{ value: "NQ", label: "Dronning Maud Land" },
	{ value: "EC", label: "Ecuador" },
	{ value: "EG", label: "Egypt" },
	{ value: "SV", label: "El Salvador" },
	{ value: "GQ", label: "Equatorial Guinea" },
	{ value: "ER", label: "Eritrea" },
	{ value: "EE", label: "Estonia" },
	{ value: "ET", label: "Ethiopia" },
	{ value: "FK", label: "Falkland Islands" },
	{ value: "FO", label: "Faroe Islands" },
	{ value: "FJ", label: "Fiji" },
	{ value: "FI", label: "Finland" },
	{ value: "GF", label: "French Guiana" },
	{ value: "PF", label: "French Polynesia" },
	{ value: "TF", label: "French Southern Territories" },
	{ value: "FQ", label: "French Southern and Antarctic Territories" },
	{ value: "GA", label: "Gabon" },
	{ value: "GM", label: "Gambia" },
	{ value: "GE", label: "Georgia" },
	{ value: "GH", label: "Ghana" },
	{ value: "GI", label: "Gibraltar" },
	{ value: "GR", label: "Greece" },
	{ value: "GL", label: "Greenland" },
	{ value: "GD", label: "Grenada" },
	{ value: "GP", label: "Guadeloupe" },
	{ value: "GU", label: "Guam" },
	{ value: "GT", label: "Guatemala" },
	{ value: "GG", label: "Guernsey" },
	{ value: "GN", label: "Guinea" },
	{ value: "GW", label: "Guinea-Bissau" },
	{ value: "GY", label: "Guyana" },
	{ value: "HT", label: "Haiti" },
	{ value: "HM", label: "Heard Island and McDonald Islands" },
	{ value: "HN", label: "Honduras" },
	{ value: "HK", label: "Hong Kong" },
	{ value: "HU", label: "Hungary" },
	{ value: "IS", label: "Iceland" },
	{ value: "IN", label: "India" },
	{ value: "ID", label: "Indonesia" },
	{ value: "IR", label: "Iran" },
	{ value: "IQ", label: "Iraq" },
	{ value: "IM", label: "Isle of Man" },
	{ value: "IL", label: "Israel" },
	{ value: "JM", label: "Jamaica" },
	{ value: "JP", label: "Japan" },
	{ value: "JE", label: "Jersey" },
	{ value: "JT", label: "Johnston Island" },
	{ value: "JO", label: "Jordan" },
	{ value: "KZ", label: "Kazakhstan" },
	{ value: "KE", label: "Kenya" },
	{ value: "KI", label: "Kiribati" },
	{ value: "KW", label: "Kuwait" },
	{ value: "KG", label: "Kyrgyzstan" },
	{ value: "LA", label: "Laos" },
	{ value: "LV", label: "Latvia" },
	{ value: "LB", label: "Lebanon" },
	{ value: "LS", label: "Lesotho" },
	{ value: "LR", label: "Liberia" },
	{ value: "LY", label: "Libya" },
	{ value: "LI", label: "Liechtenstein" },
	{ value: "LT", label: "Lithuania" },
	{ value: "LU", label: "Luxembourg" },
	{ value: "MO", label: "Macau SAR China" },
	{ value: "MK", label: "Macedonia" },
	{ value: "MG", label: "Madagascar" },
	{ value: "MW", label: "Malawi" },
	{ value: "MY", label: "Malaysia" },
	{ value: "MV", label: "Maldives" },
	{ value: "ML", label: "Mali" },
	{ value: "MT", label: "Malta" },
	{ value: "MH", label: "Marshall Islands" },
	{ value: "MQ", label: "Martinique" },
	{ value: "MR", label: "Mauritania" },
	{ value: "MU", label: "Mauritius" },
	{ value: "YT", label: "Mayotte" },
	{ value: "FX", label: "Metropolitan France" },
	{ value: "MX", label: "Mexico" },
	{ value: "FM", label: "Micronesia" },
	{ value: "MI", label: "Midway Islands" },
	{ value: "MD", label: "Moldova" },
	{ value: "MC", label: "Monaco" },
	{ value: "MN", label: "Mongolia" },
	{ value: "ME", label: "Montenegro" },
	{ value: "MS", label: "Montserrat" },
	{ value: "MA", label: "Morocco" },
	{ value: "MZ", label: "Mozambique" },
	{ value: "MM", label: "Myanmar [Burma]" },
	{ value: "NA", label: "Namibia" },
	{ value: "NR", label: "Nauru" },
	{ value: "NP", label: "Nepal" },
	{ value: "AN", label: "Netherlands Antilles" },
	{ value: "NT", label: "Neutral Zone" },
	{ value: "NC", label: "New Caledonia" },
	{ value: "NI", label: "Nicaragua" },
	{ value: "NE", label: "Niger" },
	{ value: "NG", label: "Nigeria" },
	{ value: "NU", label: "Niue" },
	{ value: "NF", label: "Norfolk Island" },
	{ value: "KP", label: "North Korea" },
	{ value: "VD", label: "North Vietnam" },
	{ value: "MP", label: "Northern Mariana Islands" },
	{ value: "NO", label: "Norway" },
	{ value: "OM", label: "Oman" },
	{ value: "PC", label: "Pacific Islands Trust Territory" },
	{ value: "PK", label: "Pakistan" },
	{ value: "PW", label: "Palau" },
	{ value: "PS", label: "Palestinian Territories" },
	{ value: "PA", label: "Panama" },
	{ value: "PZ", label: "Panama Canal Zone" },
	{ value: "PG", label: "Papua New Guinea" },
	{ value: "PY", label: "Paraguay" },
	{ value: "PE", label: "Peru" },
	{ value: "PH", label: "Philippines" },
	{ value: "PN", label: "Pitcairn Islands" },
	{ value: "PL", label: "Poland" },
	{ value: "PR", label: "Puerto Rico" },
	{ value: "QA", label: "Qatar" },
	{ value: "RO", label: "Romania" },
	{ value: "RU", label: "Russia" },
	{ value: "RW", label: "Rwanda" },
	{ value: "RE", label: "Réunion" },
	{ value: "BL", label: "Saint Barthélemy" },
	{ value: "SH", label: "Saint Helena" },
	{ value: "KN", label: "Saint Kitts and Nevis" },
	{ value: "LC", label: "Saint Lucia" },
	{ value: "MF", label: "Saint Martin" },
	{ value: "PM", label: "Saint Pierre and Miquelon" },
	{ value: "VC", label: "Saint Vincent and the Grenadines" },
	{ value: "WS", label: "Samoa" },
	{ value: "SM", label: "San Marino" },
	{ value: "SA", label: "Saudi Arabia" },
	{ value: "SN", label: "Senegal" },
	{ value: "RS", label: "Serbia" },
	{ value: "SC", label: "Seychelles" },
	{ value: "SL", label: "Sierra Leone" },
	{ value: "SG", label: "Singapore" },
	{ value: "SK", label: "Slovakia" },
	{ value: "SI", label: "Slovenia" },
	{ value: "SB", label: "Solomon Islands" },
	{ value: "SO", label: "Somalia" },
	{ value: "GS", label: "South Georgia and the South Sandwich Islands" },
	{ value: "KR", label: "South Korea" },
	{ value: "LK", label: "Sri Lanka" },
	{ value: "SD", label: "Sudan" },
	{ value: "SR", label: "Suriname" },
	{ value: "SJ", label: "Svalbard and Jan Mayen" },
	{ value: "SZ", label: "Swaziland" },
	{ value: "SE", label: "Sweden" },
	{ value: "CH", label: "Switzerland" },
	{ value: "SY", label: "Syria" },
	{ value: "ST", label: "São Tomé and Príncipe" },
	{ value: "TW", label: "Taiwan" },
	{ value: "TJ", label: "Tajikistan" },
	{ value: "TZ", label: "Tanzania" },
	{ value: "TH", label: "Thailand" },
	{ value: "TL", label: "Timor-Leste" },
	{ value: "TG", label: "Togo" },
	{ value: "TK", label: "Tokelau" },
	{ value: "TO", label: "Tonga" },
	{ value: "TT", label: "Trinidad and Tobago" },
	{ value: "TN", label: "Tunisia" },
	{ value: "TR", label: "Turkey" },
	{ value: "TM", label: "Turkmenistan" },
	{ value: "TC", label: "Turks and Caicos Islands" },
	{ value: "TV", label: "Tuvalu" },
	{ value: "UM", label: "U.S. Minor Outlying Islands" },
	{ value: "PU", label: "U.S. Miscellaneous Pacific Islands" },
	{ value: "VI", label: "U.S. Virgin Islands" },
	{ value: "UG", label: "Uganda" },
	{ value: "UA", label: "Ukraine" },
	{ value: "SU", label: "Union of Soviet Socialist Republics" },
	{ value: "AE", label: "United Arab Emirates" },
	{ value: "UY", label: "Uruguay" },
	{ value: "UZ", label: "Uzbekistan" },
	{ value: "VU", label: "Vanuatu" },
	{ value: "VA", label: "Vatican City" },
	{ value: "VE", label: "Venezuela" },
	{ value: "VN", label: "Vietnam" },
	{ value: "WK", label: "Wake Island" },
	{ value: "WF", label: "Wallis and Futuna" },
	{ value: "EH", label: "Western Sahara" },
	{ value: "YE", label: "Yemen" },
	{ value: "ZM", label: "Zambia" },
	{ value: "ZW", label: "Zimbabwe" },
	{ value: "AX", label: "Aland Islands" },
];

const ages = [
	{ value: "18", label: "18-21" },
	{ value: "21", label: "21-25" },
	{ value: "25", label: "25-30" },
	{ value: "30", label: "30-40" },
	{ value: "40", label: "40-50" },
	{ value: "50", label: "50+" },
	{ value: "60", label: "60+" },
	{ value: "70", label: "70+" },
];

const genders = [
	{ value: "F", label: "Female" },
	{ value: "M", label: "Male" },
	{ value: "T", label: "Transgender" },
	{ value: "O", label: "Other" },
];

const ethnicities = [
	{ value: "AR", label: "Arab" },
	{ value: "A", label: "Asian" },
	{ value: "B", label: "Black" },
	{ value: "C", label: "Caucasian (White)" },
	{ value: "L", label: "Latin" },
	{ value: "M", label: "Mixed" },
];

const bodySizes = [
	{ value: "S", label: "Slim / Slender" },
	{ value: "A", label: "Athletic / Toned" },
	{ value: "M", label: "Average" },
	{ value: "G", label: "Muscular" },
	{ value: "C", label: "Curvy" },
	{ value: "L", label: "Big & Beautiful" },
];

const shoeSizes = [
	{ value: "4", label: "US 4, UK 2, EU 34" },
	{ value: "5", label: "US 5, UK 3, EU 36" },
	{ value: "6", label: "US 6, UK 4, EU 37" },
	{ value: "7", label: "US 7, UK 5, EU 38" },
	{ value: "8", label: "US 8, UK 6, EU 39" },
	{ value: "9", label: "US 9, UK 7, EU 40" },
	{ value: "10", label: "US 10, UK 8, EU 41" },
	{ value: "11", label: "US 11, UK 9, EU 42" },
	{ value: "12", label: "US 12, UK 10, EU 43" },
	{ value: "13", label: "US 13, UK 11, EU 44" },
	{ value: "14", label: "US 14, UK 12, EU 45" },
	{ value: "15", label: "US 15, UK 13, EU 46" },
	{ value: "16", label: "US 16+, UK 14+, EU 47+" },
];

const yesNoOptions = [
	{ value: "1", label: "Yes" },
	{ value: "0", label: "No" },
];

const occupations = [
	{ value: "C", label: "Cabin Crew" },
	{ value: "N", label: "Nurse / Healthcare Worker" },
	{ value: "M", label: "Model" },
	{ value: "F", label: "Fitness Pro" },
	{ value: "E", label: "Entrepreneur" },
	{ value: "T", label: "Teacher" },
	{ value: "P", label: "Stay At Home Parent" },
	{ value: "A", label: "Military / Police" },
	{ value: "S", label: "Student" },
	{ value: "O", label: "Office Worker" },
	{ value: "B", label: "Blue Collar Worker" },
	{ value: "D", label: "Digital Nomad / Tech Guru" },
];

const hairColors = [
	{ value: "black", label: "Black" },
	{ value: "brown", label: "Brown" },
	{ value: "blonde", label: "Blonde" },
	{ value: "red", label: "Red" },
	{ value: "gray", label: "Gray" },
	{ value: "white", label: "White" },
	{ value: "blue", label: "Blue" },
	{ value: "pink", label: "Pink" },
	{ value: "purple", label: "Purple" },
	{ value: "green", label: "Green" },
];

const eyeColors = [
	{ value: "brown", label: "Brown" },
	{ value: "blue", label: "Blue" },
	{ value: "green", label: "Green" },
	{ value: "hazel", label: "Hazel" },
	{ value: "gray", label: "Gray" },
	{ value: "amber", label: "Amber" },
];

const heights = [
	{ value: "petite", label: "Petite" },
	{ value: "short", label: "Short" },
	{ value: "average", label: "Average" },
	{ value: "tall", label: "Tall" },
	{ value: "very_tall", label: "Very Tall" },
];

const relationshipStatuses = [
	{ value: "single", label: "Single" },
	{ value: "in_relationship", label: "In a Relationship" },
	{ value: "married", label: "Married" },
	{ value: "divorced", label: "Divorced" },
	{ value: "its_complicated", label: "It's Complicated" },
	{ value: "open_relationship", label: "Open Relationship" },
	{ value: "widowed", label: "Widowed" },
];

const paymentMethodsOptions = [
	{ value: "1", label: "PayPal" },
	{ value: "2", label: "Venmo" },
	{ value: "3", label: "CashApp" },
	{ value: "4", label: "Amazon Gift Card" },
	{ value: "10", label: "Amazon WishList" },
	{ value: "5", label: "Bank Transfer" },
	{ value: "6", label: "Stripe" },
	{ value: "7", label: "Google Pay" },
	{ value: "8", label: "Cryptocurrency" },
	{ value: "9", label: "Buy Me A Coffee" },
	{ value: "12", label: "Wishlist" },
	{ value: "13", label: "Revolut" },
];

const whatIOfferOptions = [
	{
		label: "Underwear",
		options: [
			{ value: "5", label: "Panties" },
			{ value: "6", label: "Thongs" },
			{ value: "7", label: "Lingerie" },
			{ value: "8", label: "Bras" },
		],
	},
	{
		label: "Shoes",
		options: [
			{ value: "10", label: "High Heels" },
			{ value: "11", label: "Flat Shoes" },
			{ value: "12", label: "Sneakers" },
			{ value: "13", label: "Slippers" },
			{ value: "14", label: "Uniform Shoes" },
			{ value: "22", label: "Boots" },
		],
	},
	{
		label: "Hosiery",
		options: [
			{ value: "16", label: "Socks" },
			{ value: "17", label: "Pantyhose" },
			{ value: "18", label: "Stockings" },
			{ value: "526", label: "Buy Feet Pics" },
			{ value: "527", label: "Sell Feet Pics" },
		],
	},
	{
		label: "Clothing",
		options: [
			{ value: "30", label: "Skirts" },
			{ value: "31", label: "Dresses" },
			{ value: "33", label: "Tops" },
			{ value: "34", label: "Gym Clothes" },
			{ value: "36", label: "Other Clothing" },
			{ value: "43", label: "Swimwear" },
		],
	},
	{
		label: "Naughty Extras",
		options: [
			{ value: "4", label: "Accessories" },
			{ value: "24", label: "Photo Sets" },
			{ value: "25", label: "Video Clips" },
			{ value: "26", label: "Experiences" },
			{ value: "47", label: "Dick Ratings" },
			{ value: "48", label: "Sex Toys" },
			{ value: "49", label: "Sexting" },
			{ value: "50", label: "Girlfriend Experience - GFE" },
		],
	},
	{
		label: "Instant Content",
		options: [
			{ value: "41", label: "Instant Pics" },
			{ value: "44", label: "Instant Vids" },
		],
	},
];

export default function SettingsPage() {
	const { user, profile, isLoading: authLoading, fetchProfile } = useAuth();
	const router = useRouter();

	// State for all profile fields, including the newly added ones
	const [username, setUsername] = useState("");
	const [bio, setBio] = useState("");
	const [website, setWebsite] = useState("");
	const [location, setLocation] = useState("");
	const [country, setCountry] = useState("");
	const [isSeller, setIsSeller] = useState(false);
	const [isPremiumSeller, setIsPremiumSeller] = useState(false);
	const [stripeCustomerId, setStripeCustomerId] = useState("");

	// New states for "More About You" section
	const [age, setAge] = useState("");
	const [gender, setGender] = useState("");
	const [ethnicity, setEthnicity] = useState("");
	const [bodySize, setBodySize] = useState("");
	const [shoeSize, setShoeSize] = useState("");
	const [willShowFace, setWillShowFace] = useState(""); // Corresponds to yesNoOptions
	const [occupation, setOccupation] = useState("");
	const [tattoos, setTattoos] = useState(""); // Corresponds to yesNoOptions
	const [piercings, setPiercings] = useState(""); // Corresponds to yesNoOptions
	const [hairColor, setHairColor] = useState("");
	const [eyeColor, setEyeColor] = useState("");
	const [smokes, setSmokes] = useState(""); // Corresponds to yesNoOptions
	const [drinks, setDrinks] = useState(""); // Corresponds to yesNoOptions
	const [height, setHeight] = useState("");
	const [relationshipStatus, setRelationshipStatus] = useState("");
	const [acceptedPayments, setAcceptedPayments] = useState<string[]>([]); // Multi-select
	const [whatIOffer, setWhatIOffer] = useState<string[]>([]); // Multi-select

	const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
	const [profileUpdating, setProfileUpdating] = useState(false);
	const [imageUploading, setImageUploading] = useState(false);

	const fileInputRef = useRef<HTMLInputElement>(null);
	const [showMoreAboutYou, setShowMoreAboutYou] = useState(false); // For accordion-like behavior

	// Populate form fields when profile data loads or changes
	useEffect(() => {
		if (profile) {
			setUsername(profile.username || "");
			// Type assertion for new fields, as Profile type might not yet contain them
			// This is safe if you update your DB and then regenerate types.
			setBio((profile as any).bio || "");
			setCountry((profile as any).country || "");
			setAvatarUrl(profile.avatar_url);

			// Populate new "More About You" fields
			setAge((profile as any).age || "");
			setGender((profile as any).gender || "");
			setEthnicity((profile as any).ethnicity || "");
			setBodySize((profile as any).body_size || "");
			setShoeSize((profile as any).shoe_size || "");
			setWillShowFace((profile as any).will_show_face || "");
			setOccupation((profile as any).occupation || "");
			setTattoos((profile as any).tattoos || "");
			setPiercings((profile as any).piercings || "");
			setHairColor((profile as any).hair_color || "");
			setEyeColor((profile as any).eye_color || "");
			setSmokes((profile as any).smokes || "");
			setDrinks((profile as any).drinks || "");
			setHeight((profile as any).height || "");
			setRelationshipStatus((profile as any).relationship_status || "");
			setAcceptedPayments((profile as any).accepted_payments || []);
			setWhatIOffer((profile as any).what_i_offer || []);
		}
	}, [profile]);

	const handleUpdateProfile = async (event: React.FormEvent) => {
		event.preventDefault();

		if (!user) {
			toast.error("You must be logged in to update your profile.");
			return;
		}

		setProfileUpdating(true);

		// Collect all updates, including the new fields
		const updates = {
			id: user.id,
			username,
			bio,
			country,
			avatar_url: avatarUrl,
			updated_at: new Date().toISOString(),
			// New "More About You" fields
			age,
			gender,
			ethnicity,
			body_size: bodySize, // Match DB column name
			shoe_size: shoeSize, // Match DB column name
			will_show_face: willShowFace, // Match DB column name
			occupation,
			tattoos,
			piercings,
			hair_color: hairColor, // Match DB column name
			eye_color: eyeColor, // Match DB column name
			smokes,
			drinks,
			height,
			relationship_status: relationshipStatus, // Match DB column name
			accepted_payments: acceptedPayments, // Array field
			what_i_offer: whatIOffer, // Array field
			// stripe_customer_id is usually managed server-side, keeping it read-only
		};

		const { error } = await supabase.from("profiles").upsert(updates);

		if (error) {
			toast.error(`Error updating profile: ${error.message}`);
			console.error("Error updating profile:", error);
		} else {
			await fetchProfile();
			toast.success("Profile updated successfully!");
		}
		setProfileUpdating(false);
	};

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (!file) return;

		// Check file type
		const validTypes = ["image/png", "image/jpeg", "image/gif", "image/webp"];
		if (!validTypes.includes(file.type)) {
			toast.error("Please upload a valid image file (PNG, JPEG, GIF, or WebP)");
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
			return;
		}

		// Check file size (5MB limit)
		const maxSize = 5 * 1024 * 1024; // 5MB in bytes
		if (file.size > maxSize) {
			toast.error("File size must be less than 5MB");
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
			return;
		}

		await handleImageUpload(file);
	};

	const handleImageUpload = async (file: File) => {
		if (!user) {
			toast.error("You must be logged in to upload an avatar.");
			return;
		}

		setImageUploading(true);
		const fileExt = file.name.split(".").pop();
		const fileName = `${user.id}-${Math.random()}.${fileExt}`;
		const filePath = `${fileName}`;

		try {
			const { error: uploadError, data: uploadedFile } = await supabase.storage
				.from("avatars")
				.upload(filePath, file, {
					cacheControl: "3600",
					upsert: true,
					contentType: file.type,
				});

			if (uploadError) {
				throw uploadError;
			}

			const { data: publicUrlData } = supabase.storage
				.from("avatars")
				.getPublicUrl(filePath);

			const newAvatarUrl = publicUrlData.publicUrl;

			const { error: updateError } = await supabase
				.from("profiles")
				.update({
					avatar_url: newAvatarUrl,
					updated_at: new Date().toISOString(),
				})
				.eq("id", user.id);

			if (updateError) {
				throw updateError;
			}

			setAvatarUrl(newAvatarUrl);
			await fetchProfile();
			toast.success("Avatar uploaded and profile updated!");
		} catch (error: any) {
			toast.error(`Error uploading avatar: ${error.message}`);
			console.error("Error uploading avatar:", error);
		} finally {
			setImageUploading(false);
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		}
	};

	const handleImageDelete = async () => {
		if (!user || !avatarUrl) {
			toast.error("No avatar to delete or not logged in.");
			return;
		}

		setImageUploading(true);
		try {
			const urlParts = avatarUrl.split("/");
			const fileNameInBucket = urlParts[urlParts.length - 1];
			const { error: deleteError } = await supabase.storage
				.from("avatars")
				.remove([fileNameInBucket]);

			if (deleteError) {
				throw deleteError;
			}

			const { error: updateError } = await supabase
				.from("profiles")
				.update({ avatar_url: null, updated_at: new Date().toISOString() })
				.eq("id", user.id);

			if (updateError) {
				throw updateError;
			}

			setAvatarUrl(null);
			await fetchProfile();
			toast.success("Avatar deleted successfully!");
		} catch (error: any) {
			toast.error(`Error deleting avatar: ${error.message}`);
			console.error("Error deleting avatar:", error);
		} finally {
			setImageUploading(false);
		}
	};

	// Handle multi-select changes for 'Accepted Payments'
	const handleAcceptedPaymentsChange = (
		e: React.ChangeEvent<HTMLSelectElement>
	) => {
		const selectedOptions = Array.from(e.target.selectedOptions).map(
			(option) => option.value
		);
		setAcceptedPayments(selectedOptions);
	};

	// Handle multi-select changes for 'What I Offer'
	const handleWhatIOfferChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedOptions = Array.from(e.target.selectedOptions).map(
			(option) => option.value
		);
		setWhatIOffer(selectedOptions);
	};

	if (authLoading || !user) {
		return (
			<div className='flex min-h-screen items-center justify-center'>
				<Loader2 className='h-10 w-10 animate-spin text-primary-violet' />
				<p className='ml-2 text-lg text-gray-600'>Loading settings...</p>
			</div>
		);
	}

	return (
		<div className='container mx-auto px-4 py-8 max-w-2xl'>
			<h1 className='text-3xl font-bold mb-6 text-violet-600'>Settings</h1>

			{/* General Information */}
			<Card className='w-full mb-8 bg-card-bg border shadow-lg text-slate-200 p-4'>
				<CardHeader className='pb-2'>
					<CardTitle className='text-xl font-semibold'>
						Profile Information
					</CardTitle>
				</CardHeader>
				<CardContent className="max-w-full">
					<form onSubmit={handleUpdateProfile}>
						<div className='grid w-full items-center gap-4'>
							<div className='flex flex-col space-y-1.5'>
								<Input
									id='email'
									type='email'
									value={user.email || ""}
									readOnly
								/>
							</div>
							<div className='flex flex-col space-y-1.5'>
								<Input
									id='username'
									type='text'
									placeholder='Enter your username'
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									required
								/>
							</div>
							<div className='flex flex-col space-y-1.5'>
								<Label htmlFor='bio'>Bio</Label>
								<Textarea
									id='bio'
									placeholder='Tell us about yourself...'
									value={bio}
									onChange={(e) => setBio(e.target.value)}
									rows={4}
								/>
							</div>
							<div className='flex flex-col space-y-1.5'>
								<Label htmlFor='country'>Country</Label>
								<select
									id='country'
									className='flex h-10 w-full border p-2'
									value={country}
									onChange={(e) => setCountry(e.target.value)}>
									<option value=''>Select a country</option>
									{countries.map((c) => (
										<option
											key={c.value}
											value={c.value}>
											{c.label}
										</option>
									))}
								</select>
							</div>

							{/* Avatar Upload Section */}
							<div className='flex flex-col space-y-1.5'>
								<Label>Profile Picture</Label>
								<div className='flex items-center space-x-4'>
									<div className='relative w-24 h-24 rounded-full overflow-hidden border border-gray-300'>
										{avatarUrl ? (
											<Image
												src={avatarUrl}
												alt='Avatar'
												fill
												style={{ objectFit: "cover" }}
												sizes='(max-width: 768px) 100vw, 33vw'
											/>
										) : (
											<div className='flex items-center justify-center w-full h-full text-gray-500'>
												<ImageIcon className='w-10 h-10' />
											</div>
										)}
									</div>
									<div className='flex flex-col space-y-2'>
										<Input
											type='file'
											id='avatarInput'
											accept='.png,.jpg,.jpeg,.gif,.webp'
											onChange={handleFileChange}
											className='hidden'
											ref={fileInputRef}
											disabled={imageUploading}
										/>
										<Button
											type='button'
											onClick={() => fileInputRef.current?.click()}
											disabled={imageUploading}
											className='w-fit'>
											{imageUploading ? (
												<>
													<Loader2 className='mr-2 h-4 w-4 animate-spin' />{" "}
													Uploading...
												</>
											) : (
												<>
													Upload New Picture
													<br />
													<small>No nudity — images will be removed.</small>
												</>
											)}
										</Button>
										{avatarUrl && (
											<Button
												type='button'
												variant='destructive'
												onClick={handleImageDelete}
												disabled={imageUploading}
												className='w-fit'>
												{imageUploading ? (
													<>
														<Loader2 className='mr-2 h-4 w-4 animate-spin' />{" "}
														Deleting...
													</>
												) : (
													"Remove Picture"
												)}
											</Button>
										)}
									</div>
								</div>
							</div>

							<Button
								type='submit'
								className='w-full'
								disabled={profileUpdating || imageUploading}>
								{profileUpdating ? (
									<>
										<Loader2 className='w-4 h-4 mr-2 animate-spin' /> Saving...
									</>
								) : (
									"Save Changes"
								)}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>

			{/* More About You Section (Accordion) */}
			<Card className='mb-8 bg-card-bg border p-4'>
				<CardHeader
					className='pb-2 cursor-pointer'
					onClick={() => setShowMoreAboutYou(!showMoreAboutYou)}>
					<CardTitle className='text-3xl text-violet-600 font-semibold w-full text-center flex justify-between items-center'>
						More About You
						{showMoreAboutYou ? (
							<ChevronUp className='h-5 w-5' />
						) : (
							<ChevronDown className='h-5 w-5' />
						)}
					</CardTitle>
					<hr className='mt-2 border-t border' />
				</CardHeader>
				{showMoreAboutYou && (
					<CardContent>
						<form onSubmit={handleUpdateProfile}>
							<div className='grid w-full items-center gap-4'>
								<div className='flex flex-col space-y-1.5'>
									<Label htmlFor='age'>Age Range</Label>
									<select
										id='age'
										className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background'
										value={age}
										onChange={(e) => setAge(e.target.value)}>
										<option value=''>Select age range</option>
										{ages.map((o) => (
											<option
												key={o.value}
												value={o.value}>
												{o.label}
											</option>
										))}
									</select>
								</div>
								<div className='flex flex-col space-y-1.5'>
									<Label htmlFor='gender'>Gender</Label>
									<select
										id='gender'
										className='flex h-10 w-full bg-card-bg text-slate-200 border px-3 py-2 text-base'
										value={gender}
										onChange={(e) => setGender(e.target.value)}>
										<option value=''>Select gender</option>
										{genders.map((o) => (
											<option
												key={o.value}
												value={o.value}>
												{o.label}
											</option>
										))}
									</select>
								</div>
								<div className='flex flex-col space-y-1.5'>
									<Label htmlFor='ethnicity'>Ethnicity</Label>
									<select
										id='ethnicity'
										className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background'
										value={ethnicity}
										onChange={(e) => setEthnicity(e.target.value)}>
										<option value=''>Select ethnicity</option>
										{ethnicities.map((o) => (
											<option
												key={o.value}
												value={o.value}>
												{o.label}
											</option>
										))}
									</select>
								</div>
								<div className='flex flex-col space-y-1.5'>
									<Label htmlFor='bodySize'>Body Size</Label>
									<select
										id='bodySize'
										className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background'
										value={bodySize}
										onChange={(e) => setBodySize(e.target.value)}>
										<option value=''>Select body size</option>
										{bodySizes.map((o) => (
											<option
												key={o.value}
												value={o.value}>
												{o.label}
											</option>
										))}
									</select>
								</div>
								<div className='flex flex-col space-y-1.5'>
									<Label htmlFor='shoeSize'>Shoe Size</Label>
									<select
										id='shoeSize'
										className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background'
										value={shoeSize}
										onChange={(e) => setShoeSize(e.target.value)}>
										<option value=''>Select shoe size</option>
										{shoeSizes.map((o) => (
											<option
												key={o.value}
												value={o.value}>
												{o.label}
											</option>
										))}
									</select>
								</div>
								<div className='flex flex-col space-y-1.5'>
									<Label htmlFor='willShowFace'>Will Show Face</Label>
									<select
										id='willShowFace'
										className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background'
										value={willShowFace}
										onChange={(e) => setWillShowFace(e.target.value)}>
										<option value=''>Select option</option>
										{yesNoOptions.map((o) => (
											<option
												key={o.value}
												value={o.value}>
												{o.label}
											</option>
										))}
									</select>
								</div>
								<div className='flex flex-col space-y-1.5'>
									<Label htmlFor='occupation'>Occupation</Label>
									<select
										id='occupation'
										className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background'
										value={occupation}
										onChange={(e) => setOccupation(e.target.value)}>
										<option value=''>Select occupation</option>
										{occupations.map((o) => (
											<option
												key={o.value}
												value={o.value}>
												{o.label}
											</option>
										))}
									</select>
								</div>
								<div className='flex flex-col space-y-1.5'>
									<Label htmlFor='tattoos'>Tattoos</Label>
									<select
										id='tattoos'
										className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background'
										value={tattoos}
										onChange={(e) => setTattoos(e.target.value)}>
										<option value=''>Select option</option>
										{yesNoOptions.map((o) => (
											<option
												key={o.value}
												value={o.value}>
												{o.label}
											</option>
										))}
									</select>
								</div>
								<div className='flex flex-col space-y-1.5'>
									<Label htmlFor='piercings'>Piercings</Label>
									<select
										id='piercings'
										className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background'
										value={piercings}
										onChange={(e) => setPiercings(e.target.value)}>
										<option value=''>Select option</option>
										{yesNoOptions.map((o) => (
											<option
												key={o.value}
												value={o.value}>
												{o.label}
											</option>
										))}
									</select>
								</div>
								<div className='flex flex-col space-y-1.5'>
									<Label htmlFor='hairColor'>Hair Color</Label>
									<select
										id='hairColor'
										className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background'
										value={hairColor}
										onChange={(e) => setHairColor(e.target.value)}>
										<option value=''>Select hair color</option>
										{hairColors.map((o) => (
											<option
												key={o.value}
												value={o.value}>
												{o.label}
											</option>
										))}
									</select>
								</div>
								<div className='flex flex-col space-y-1.5'>
									<Label htmlFor='eyeColor'>Eye Color</Label>
									<select
										id='eyeColor'
										className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background'
										value={eyeColor}
										onChange={(e) => setEyeColor(e.target.value)}>
										<option value=''>Select eye color</option>
										{eyeColors.map((o) => (
											<option
												key={o.value}
												value={o.value}>
												{o.label}
											</option>
										))}
									</select>
								</div>
								<div className='flex flex-col space-y-1.5'>
									<Label htmlFor='smokes'>Smokes</Label>
									<select
										id='smokes'
										className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background'
										value={smokes}
										onChange={(e) => setSmokes(e.target.value)}>
										<option value=''>Select option</option>
										{yesNoOptions.map((o) => (
											<option
												key={o.value}
												value={o.value}>
												{o.label}
											</option>
										))}
									</select>
								</div>
								<div className='flex flex-col space-y-1.5'>
									<Label htmlFor='drinks'>Drinks</Label>
									<select
										id='drinks'
										className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background'
										value={drinks}
										onChange={(e) => setDrinks(e.target.value)}>
										<option value=''>Select option</option>
										{yesNoOptions.map((o) => (
											<option
												key={o.value}
												value={o.value}>
												{o.label}
											</option>
										))}
									</select>
								</div>
								<div className='flex flex-col space-y-1.5'>
									<Label htmlFor='height'>Height</Label>
									<select
										id='height'
										className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background'
										value={height}
										onChange={(e) => setHeight(e.target.value)}>
										<option value=''>Select height</option>
										{heights.map((o) => (
											<option
												key={o.value}
												value={o.value}>
												{o.label}
											</option>
										))}
									</select>
								</div>
								<div className='flex flex-col space-y-1.5'>
									<Label htmlFor='relationshipStatus'>
										Relationship Status
									</Label>
									<select
										id='relationshipStatus'
										className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background'
										value={relationshipStatus}
										onChange={(e) => setRelationshipStatus(e.target.value)}>
										<option value=''>Select status</option>
										{relationshipStatuses.map((o) => (
											<option
												key={o.value}
												value={o.value}>
												{o.label}
											</option>
										))}
									</select>
								</div>

								<Button
									type='submit'
									className='w-full'
									disabled={profileUpdating || imageUploading}>
									{profileUpdating ? (
										<>
											<Loader2 className='w-4 h-4 mr-2 animate-spin' />{" "}
											Saving...
										</>
									) : (
										"Save More About You"
									)}
								</Button>
							</div>
						</form>
					</CardContent>
				)}
			</Card>

			{/* What I Offer Section */}
			<Card className='mb-8 bg-card-bg border-[1px] border-border-default shadow-lg text-text-default rounded-5px p-4'>
				<CardHeader className='pb-2'>
					<CardTitle className='text-xl font-semibold'>What I Offer</CardTitle>
					<CardDescription className='text-muted-foreground'>
						Select the types of items/content you offer.
					</CardDescription>
					<hr className='mt-2 border-t border-border-default' />
				</CardHeader>
				<CardContent>
					<form onSubmit={handleUpdateProfile}>
						<div className='grid w-full items-center gap-4'>
							<div className='flex flex-col space-y-1.5'>
								<Label htmlFor='whatIOffer'>Items/Content Offered</Label>
								<select
									id='whatIOffer'
									multiple // Enable multi-select
									className='flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-48' // Increased height for multi-select
									value={whatIOffer}
									onChange={handleWhatIOfferChange}>
									{whatIOfferOptions.map((group) => (
										<optgroup
											key={group.label}
											label={group.label}>
											{group.options.map((o) => (
												<option
													key={o.value}
													value={o.value}>
													{o.label}
												</option>
											))}
										</optgroup>
									))}
								</select>
								<p className='text-sm text-muted-foreground mt-1'>
									Hold Ctrl (Windows) or Cmd (Mac) to select multiple options.
								</p>
							</div>
							<Button
								type='submit'
								className='w-full'
								disabled={profileUpdating || imageUploading}>
								{profileUpdating ? (
									<>
										<Loader2 className='w-4 h-4 mr-2 animate-spin' /> Saving...
									</>
								) : (
									"Save Offerings"
								)}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>

			{/* Accepted Payments Section */}
			<Card className='mb-8 bg-card-bg border-[1px] border-border-default shadow-lg text-text-default rounded-5px p-4'>
				<CardHeader className='pb-2'>
					<CardTitle className='text-xl font-semibold'>
						Accepted Payment Methods
					</CardTitle>
					<CardDescription className='text-muted-foreground'>
						Select the payment methods you accept.
					</CardDescription>
					<hr className='mt-2 border-t border-border-default' />
				</CardHeader>
				<CardContent>
					<form onSubmit={handleUpdateProfile}>
						<div className='grid w-full items-center gap-4'>
							<div className='flex flex-col space-y-1.5'>
								<Label htmlFor='acceptedPayments'>Payment Methods</Label>
								<select
									id='acceptedPayments'
									multiple // Enable multi-select
									className='flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-48' // Increased height
									value={acceptedPayments}
									onChange={handleAcceptedPaymentsChange}>
									{paymentMethodsOptions.map((o) => (
										<option
											key={o.value}
											value={o.value}>
											{o.label}
										</option>
									))}
								</select>
								<p className='text-sm text-muted-foreground mt-1'>
									Hold Ctrl (Windows) or Cmd (Mac) to select multiple options.
								</p>
							</div>
							<Button
								type='submit'
								className='w-full'
								disabled={profileUpdating || imageUploading}>
								{profileUpdating ? (
									<>
										<Loader2 className='w-4 h-4 mr-2 animate-spin' /> Saving...
									</>
								) : (
									"Save Payment Methods"
								)}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>

			{/* Delete Account Section */}
			<Card className='bg-card-bg border-[1px] border-border-default shadow-lg text-text-default rounded-5px p-4'>
				<CardHeader className='pb-2'>
					<CardTitle className='text-xl font-semibold'>
						Delete Your Account
					</CardTitle>
					<hr className='mt-2 border-t border-border-default' />
				</CardHeader>
				<CardContent>
					<div className='bg-red-900/20 border border-red-700 text-red-300 p-4 rounded-md'>
						<p className='text-sm mb-3'>
							Permanently deleting your account will remove all your data on
							Taboo Toybox. However, please be aware that we will still hold
							data privately to assist with any disputes should any be reported.
						</p>
						<Button
							variant='destructive'
							className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors'
							disabled={true}>
							Delete Account
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
