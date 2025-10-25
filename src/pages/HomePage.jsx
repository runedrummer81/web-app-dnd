import { useState, useEffect, useMemo } from "react";
import { db } from "../firebase"; // kun db fra firebase.js
import { Link, useNavigate } from "react-router";
import BGArtwork from "../components/BGArtwork";
import loadcampaignImage from "/images/loadcampaign.jpg";
import newcampaignImage from "/images/newcampaign.jpg";
import encountersImage from "/images/encounter.jpeg";
import informationImage from "/images/information.jpg";
import SelectedItem from "../components/SelectedItem";

export default function HomePage() {
  const [active, setActive] = useState(null); // Start with nothing
  const [lastCampaign, setLastCampaign] = useState(null);
  const navigate = useNavigate(); // ✅ Add navigate hook

  // ✅ Wrapped in useMemo to prevent recreating object on every render
  const routes = useMemo(
    () => ({
      "Continue Campaign": "/session",
      "Load Campaign": "/load",
      "New Campaign": "/newcampaign",
      Encounters: "/encounters",
      Information: "/info",
    }),
    []
  );

  // Generate menu items dynamically based on lastCampaign
  // ✅ Wrapped in useMemo to prevent recreating array on every render
  const menuItems = useMemo(
    () => [
      ...(lastCampaign ? ["Continue Campaign", "Load Campaign"] : []),
      "New Campaign",
      "Encounters",
      "Information",
    ],
    [lastCampaign]
  );

  useEffect(() => {
    const fetchLastCampaign = async () => {
      const campaignId = localStorage.getItem("selectedCampaignId");
      if (!campaignId) {
        setActive("New Campaign"); // No last campaign, default to New Campaign
        return;
      }

      try {
        const { doc, getDoc } = await import("firebase/firestore");
        const docRef = await getDoc(doc(db, "Campaigns", campaignId));

        if (docRef.exists()) {
          const campaign = { id: docRef.id, ...docRef.data() };
          setLastCampaign(campaign);
          setActive("Continue Campaign"); // Last campaign exists
        } else {
          setActive("New Campaign"); // fallback
        }
      } catch (err) {
        console.error("🔥 Kunne ikke hente sidste campaign:", err);
        setActive("New Campaign"); // fallback
      }
    };

    fetchLastCampaign();
  }, []);

  // ✅ Keyboard navigation (ArrowUp/ArrowDown/Enter)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault(); // Prevent page scroll

        const currentIndex = menuItems.findIndex((item) => item === active);
        let newIndex;

        if (e.key === "ArrowDown") {
          newIndex = (currentIndex + 1) % menuItems.length; // Cycle forward
        } else {
          newIndex = (currentIndex - 1 + menuItems.length) % menuItems.length; // Cycle backward
        }

        setActive(menuItems[newIndex]);
      } else if (e.key === "Enter" && active) {
        // ✅ Navigate to the selected menu item when Enter is pressed
        e.preventDefault();
        const route = routes[active];

        // Pass state if it's Continue Campaign or Load Campaign
        if (active === "Continue Campaign" || active === "Load Campaign") {
          navigate(route, {
            state: { campaignId: lastCampaign?.id, from: "/home" },
          });
        } else {
          navigate(route);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active, menuItems, navigate, routes, lastCampaign]);

  // ✅ Scroll/wheel navigation
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault(); // Prevent default page scroll

      const currentIndex = menuItems.findIndex((item) => item === active);
      let newIndex;

      if (e.deltaY > 0) {
        // Scroll down
        newIndex = (currentIndex + 1) % menuItems.length;
      } else {
        // Scroll up
        newIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
      }

      setActive(menuItems[newIndex]);
    };

    // Add wheel listener with passive: false to allow preventDefault
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [active, menuItems]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BGArtwork
        imageUrl={
          active === "Encounters"
            ? encountersImage
            : active === "Information"
            ? informationImage
            : active === "Load Campaign"
            ? loadcampaignImage
            : active === "New Campaign"
            ? newcampaignImage
            : lastCampaign?.image
        }
      />

      <section className="grid grid-cols-[auto_1fr] items-stretch min-w-screen min-h-screen px-30 gap-15 relative z-10">
        {/* Left column */}
        <div className="flex flex-col space-y-9 min-h-screen justify-center">
          {active !== null && // only render when we know what to show
            menuItems.map((label) => (
              <Link
                key={label}
                to={routes[label]}
                state={
                  label === "Continue Campaign" || label === "Load Campaign"
                    ? { campaignId: lastCampaign?.id, from: "/home" }
                    : undefined
                }
                className="no-underline"
                onMouseEnter={() => setActive(label)}
              >
                <SelectedItem
                  isSelected={active === label}
                  showArrow={true}
                  animate={false} // Set to true if you want entrance animations
                >
                  {label}
                </SelectedItem>
              </Link>
            ))}
        </div>

        {/* Right column */}
        <div className="absolute  grid-cols-[auto_1fr] justify-center items-end bottom-0 right-20 p-28 transition-all duration-500">
          <div
            id="text"
            className={`${active ? "hidden" : ""} flex flex-col items-center `}
          ></div>

          {active ? (
            <div className=" text-gray-700 text-center">
              {active === "Continue Campaign" && (
                <div>
                  <div className="flex gap-5 text-4xl font-black text-[var(--primary)] text-center mt-4 uppercase">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 257.6 130.8"
                      className="fill-[var(--secondary)] w-8 h-auto -scale-x-100"
                    >
                      <path d="M171.5,114.9c-.4-13.6,18-14.3,12.2-15.2-2.6-.4-5-1-7-.5-14.6-10.9-35.6-6.8-52.3-2.6-23.9,6-45.9,17.6-69.5,24.2C23.5,129.5.3,126.4.3,126.4c19.8-1.3,39.1-5.8,55.9-13.1C100.3,94.2,123.8,37.5,88.8,0c14.5,3.5,24.5,23.4,24,37.4-.2,4,5.2,4.2,6.6,1.2,8.1-2.3,12.6,6.3,11.8,14.3-1.7,16.4-19.7,29.1-33.7,33.4-2.9,1.9-.7,6.6,2.6,5.5,41.7-13.4,84.6-51.4,130.7-27.5-5.2-.2-26.1,3.6-27.2,14,.1,2.2,4.1,2.6,5.7,2.6,18.8.4,29.3,18.8,48.3,20.4-5.4,3.2-10.7,6.5-16.7,8.8-16.5,5.8-25.2,0-38-9.7-1.2-.9-4.3-1.6-3.4,1.4,2.3,7.3,4,15.4-.6,22-8.3,13.1-28.3,6.3-27.4-8.9h0Z" />
                      <path d="M17.1,72.5h0c10.8-9.3,32.3-14.9,40.8.5l.3.8c5.8-5.4,5.8-17.5-3.1-19.3,12.1-6.8,16.8-17.2,12.9-30.7-2-7-6.2-12.6-11.7-16.7,4.4,16.4-6.9,32-19.4,41.3-9.5,7-18.9,12.4-26,22.3-5.4,7.6-8.5,15.5-10.9,23.9,4.2-8.5,10.4-16.2,17.1-22h0Z" />
                    </svg>

                    {lastCampaign?.id
                      .replace(/^camp_/, "") // remove "camp_" at the start
                      .replace(/_/g, " ") // replace underscores with spaces
                      .toUpperCase() || ""}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 257.6 130.8"
                      className="fill-[var(--secondary)] w-8 h-auto "
                    >
                      <path d="M171.5,114.9c-.4-13.6,18-14.3,12.2-15.2-2.6-.4-5-1-7-.5-14.6-10.9-35.6-6.8-52.3-2.6-23.9,6-45.9,17.6-69.5,24.2C23.5,129.5.3,126.4.3,126.4c19.8-1.3,39.1-5.8,55.9-13.1C100.3,94.2,123.8,37.5,88.8,0c14.5,3.5,24.5,23.4,24,37.4-.2,4,5.2,4.2,6.6,1.2,8.1-2.3,12.6,6.3,11.8,14.3-1.7,16.4-19.7,29.1-33.7,33.4-2.9,1.9-.7,6.6,2.6,5.5,41.7-13.4,84.6-51.4,130.7-27.5-5.2-.2-26.1,3.6-27.2,14,.1,2.2,4.1,2.6,5.7,2.6,18.8.4,29.3,18.8,48.3,20.4-5.4,3.2-10.7,6.5-16.7,8.8-16.5,5.8-25.2,0-38-9.7-1.2-.9-4.3-1.6-3.4,1.4,2.3,7.3,4,15.4-.6,22-8.3,13.1-28.3,6.3-27.4-8.9h0Z" />
                      <path d="M17.1,72.5h0c10.8-9.3,32.3-14.9,40.8.5l.3.8c5.8-5.4,5.8-17.5-3.1-19.3,12.1-6.8,16.8-17.2,12.9-30.7-2-7-6.2-12.6-11.7-16.7,4.4,16.4-6.9,32-19.4,41.3-9.5,7-18.9,12.4-26,22.3-5.4,7.6-8.5,15.5-10.9,23.9,4.2-8.5,10.4-16.2,17.1-22h0Z" />
                    </svg>
                  </div>
                </div>
              )}
              {active === "Load Campaign" && (
                <div className="flex gap-5 text-4xl font-black text-[var(--primary)] text-center mt-4 uppercase">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 257.6 130.8"
                    className="fill-[var(--secondary)] w-8 h-auto -scale-x-100"
                  >
                    <path d="M171.5,114.9c-.4-13.6,18-14.3,12.2-15.2-2.6-.4-5-1-7-.5-14.6-10.9-35.6-6.8-52.3-2.6-23.9,6-45.9,17.6-69.5,24.2C23.5,129.5.3,126.4.3,126.4c19.8-1.3,39.1-5.8,55.9-13.1C100.3,94.2,123.8,37.5,88.8,0c14.5,3.5,24.5,23.4,24,37.4-.2,4,5.2,4.2,6.6,1.2,8.1-2.3,12.6,6.3,11.8,14.3-1.7,16.4-19.7,29.1-33.7,33.4-2.9,1.9-.7,6.6,2.6,5.5,41.7-13.4,84.6-51.4,130.7-27.5-5.2-.2-26.1,3.6-27.2,14,.1,2.2,4.1,2.6,5.7,2.6,18.8.4,29.3,18.8,48.3,20.4-5.4,3.2-10.7,6.5-16.7,8.8-16.5,5.8-25.2,0-38-9.7-1.2-.9-4.3-1.6-3.4,1.4,2.3,7.3,4,15.4-.6,22-8.3,13.1-28.3,6.3-27.4-8.9h0Z" />
                    <path d="M17.1,72.5h0c10.8-9.3,32.3-14.9,40.8.5l.3.8c5.8-5.4,5.8-17.5-3.1-19.3,12.1-6.8,16.8-17.2,12.9-30.7-2-7-6.2-12.6-11.7-16.7,4.4,16.4-6.9,32-19.4,41.3-9.5,7-18.9,12.4-26,22.3-5.4,7.6-8.5,15.5-10.9,23.9,4.2-8.5,10.4-16.2,17.1-22h0Z" />
                  </svg>
                  Your worlds await your return
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 257.6 130.8"
                    className="fill-[var(--secondary)] w-8 h-auto "
                  >
                    <path d="M171.5,114.9c-.4-13.6,18-14.3,12.2-15.2-2.6-.4-5-1-7-.5-14.6-10.9-35.6-6.8-52.3-2.6-23.9,6-45.9,17.6-69.5,24.2C23.5,129.5.3,126.4.3,126.4c19.8-1.3,39.1-5.8,55.9-13.1C100.3,94.2,123.8,37.5,88.8,0c14.5,3.5,24.5,23.4,24,37.4-.2,4,5.2,4.2,6.6,1.2,8.1-2.3,12.6,6.3,11.8,14.3-1.7,16.4-19.7,29.1-33.7,33.4-2.9,1.9-.7,6.6,2.6,5.5,41.7-13.4,84.6-51.4,130.7-27.5-5.2-.2-26.1,3.6-27.2,14,.1,2.2,4.1,2.6,5.7,2.6,18.8.4,29.3,18.8,48.3,20.4-5.4,3.2-10.7,6.5-16.7,8.8-16.5,5.8-25.2,0-38-9.7-1.2-.9-4.3-1.6-3.4,1.4,2.3,7.3,4,15.4-.6,22-8.3,13.1-28.3,6.3-27.4-8.9h0Z" />
                    <path d="M17.1,72.5h0c10.8-9.3,32.3-14.9,40.8.5l.3.8c5.8-5.4,5.8-17.5-3.1-19.3,12.1-6.8,16.8-17.2,12.9-30.7-2-7-6.2-12.6-11.7-16.7,4.4,16.4-6.9,32-19.4,41.3-9.5,7-18.9,12.4-26,22.3-5.4,7.6-8.5,15.5-10.9,23.9,4.2-8.5,10.4-16.2,17.1-22h0Z" />
                  </svg>
                </div>
              )}
              {active === "New Campaign" && (
                <div className="flex gap-5 text-4xl font-black text-[var(--primary)] text-center mt-4 uppercase">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 257.6 130.8"
                    className="fill-[var(--secondary)] w-8 h-auto -scale-x-100"
                  >
                    <path d="M171.5,114.9c-.4-13.6,18-14.3,12.2-15.2-2.6-.4-5-1-7-.5-14.6-10.9-35.6-6.8-52.3-2.6-23.9,6-45.9,17.6-69.5,24.2C23.5,129.5.3,126.4.3,126.4c19.8-1.3,39.1-5.8,55.9-13.1C100.3,94.2,123.8,37.5,88.8,0c14.5,3.5,24.5,23.4,24,37.4-.2,4,5.2,4.2,6.6,1.2,8.1-2.3,12.6,6.3,11.8,14.3-1.7,16.4-19.7,29.1-33.7,33.4-2.9,1.9-.7,6.6,2.6,5.5,41.7-13.4,84.6-51.4,130.7-27.5-5.2-.2-26.1,3.6-27.2,14,.1,2.2,4.1,2.6,5.7,2.6,18.8.4,29.3,18.8,48.3,20.4-5.4,3.2-10.7,6.5-16.7,8.8-16.5,5.8-25.2,0-38-9.7-1.2-.9-4.3-1.6-3.4,1.4,2.3,7.3,4,15.4-.6,22-8.3,13.1-28.3,6.3-27.4-8.9h0Z" />
                    <path d="M17.1,72.5h0c10.8-9.3,32.3-14.9,40.8.5l.3.8c5.8-5.4,5.8-17.5-3.1-19.3,12.1-6.8,16.8-17.2,12.9-30.7-2-7-6.2-12.6-11.7-16.7,4.4,16.4-6.9,32-19.4,41.3-9.5,7-18.9,12.4-26,22.3-5.4,7.6-8.5,15.5-10.9,23.9,4.2-8.5,10.4-16.2,17.1-22h0Z" />
                  </svg>
                  Begin a story of your own
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 257.6 130.8"
                    className="fill-[var(--secondary)] w-8 h-auto "
                  >
                    <path d="M171.5,114.9c-.4-13.6,18-14.3,12.2-15.2-2.6-.4-5-1-7-.5-14.6-10.9-35.6-6.8-52.3-2.6-23.9,6-45.9,17.6-69.5,24.2C23.5,129.5.3,126.4.3,126.4c19.8-1.3,39.1-5.8,55.9-13.1C100.3,94.2,123.8,37.5,88.8,0c14.5,3.5,24.5,23.4,24,37.4-.2,4,5.2,4.2,6.6,1.2,8.1-2.3,12.6,6.3,11.8,14.3-1.7,16.4-19.7,29.1-33.7,33.4-2.9,1.9-.7,6.6,2.6,5.5,41.7-13.4,84.6-51.4,130.7-27.5-5.2-.2-26.1,3.6-27.2,14,.1,2.2,4.1,2.6,5.7,2.6,18.8.4,29.3,18.8,48.3,20.4-5.4,3.2-10.7,6.5-16.7,8.8-16.5,5.8-25.2,0-38-9.7-1.2-.9-4.3-1.6-3.4,1.4,2.3,7.3,4,15.4-.6,22-8.3,13.1-28.3,6.3-27.4-8.9h0Z" />
                    <path d="M17.1,72.5h0c10.8-9.3,32.3-14.9,40.8.5l.3.8c5.8-5.4,5.8-17.5-3.1-19.3,12.1-6.8,16.8-17.2,12.9-30.7-2-7-6.2-12.6-11.7-16.7,4.4,16.4-6.9,32-19.4,41.3-9.5,7-18.9,12.4-26,22.3-5.4,7.6-8.5,15.5-10.9,23.9,4.2-8.5,10.4-16.2,17.1-22h0Z" />
                  </svg>
                </div>
              )}
              {active === "Encounters" && (
                <div className="flex gap-5 text-4xl font-black text-[var(--primary)] text-center mt-4 uppercase">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 257.6 130.8"
                    className="fill-[var(--secondary)] w-8 h-auto -scale-x-100"
                  >
                    <path d="M171.5,114.9c-.4-13.6,18-14.3,12.2-15.2-2.6-.4-5-1-7-.5-14.6-10.9-35.6-6.8-52.3-2.6-23.9,6-45.9,17.6-69.5,24.2C23.5,129.5.3,126.4.3,126.4c19.8-1.3,39.1-5.8,55.9-13.1C100.3,94.2,123.8,37.5,88.8,0c14.5,3.5,24.5,23.4,24,37.4-.2,4,5.2,4.2,6.6,1.2,8.1-2.3,12.6,6.3,11.8,14.3-1.7,16.4-19.7,29.1-33.7,33.4-2.9,1.9-.7,6.6,2.6,5.5,41.7-13.4,84.6-51.4,130.7-27.5-5.2-.2-26.1,3.6-27.2,14,.1,2.2,4.1,2.6,5.7,2.6,18.8.4,29.3,18.8,48.3,20.4-5.4,3.2-10.7,6.5-16.7,8.8-16.5,5.8-25.2,0-38-9.7-1.2-.9-4.3-1.6-3.4,1.4,2.3,7.3,4,15.4-.6,22-8.3,13.1-28.3,6.3-27.4-8.9h0Z" />
                    <path d="M17.1,72.5h0c10.8-9.3,32.3-14.9,40.8.5l.3.8c5.8-5.4,5.8-17.5-3.1-19.3,12.1-6.8,16.8-17.2,12.9-30.7-2-7-6.2-12.6-11.7-16.7,4.4,16.4-6.9,32-19.4,41.3-9.5,7-18.9,12.4-26,22.3-5.4,7.6-8.5,15.5-10.9,23.9,4.2-8.5,10.4-16.2,17.1-22h0Z" />
                  </svg>
                  Create foes, friends, and stories
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 257.6 130.8"
                    className="fill-[var(--secondary)] w-8 h-auto "
                  >
                    <path d="M171.5,114.9c-.4-13.6,18-14.3,12.2-15.2-2.6-.4-5-1-7-.5-14.6-10.9-35.6-6.8-52.3-2.6-23.9,6-45.9,17.6-69.5,24.2C23.5,129.5.3,126.4.3,126.4c19.8-1.3,39.1-5.8,55.9-13.1C100.3,94.2,123.8,37.5,88.8,0c14.5,3.5,24.5,23.4,24,37.4-.2,4,5.2,4.2,6.6,1.2,8.1-2.3,12.6,6.3,11.8,14.3-1.7,16.4-19.7,29.1-33.7,33.4-2.9,1.9-.7,6.6,2.6,5.5,41.7-13.4,84.6-51.4,130.7-27.5-5.2-.2-26.1,3.6-27.2,14,.1,2.2,4.1,2.6,5.7,2.6,18.8.4,29.3,18.8,48.3,20.4-5.4,3.2-10.7,6.5-16.7,8.8-16.5,5.8-25.2,0-38-9.7-1.2-.9-4.3-1.6-3.4,1.4,2.3,7.3,4,15.4-.6,22-8.3,13.1-28.3,6.3-27.4-8.9h0Z" />
                    <path d="M17.1,72.5h0c10.8-9.3,32.3-14.9,40.8.5l.3.8c5.8-5.4,5.8-17.5-3.1-19.3,12.1-6.8,16.8-17.2,12.9-30.7-2-7-6.2-12.6-11.7-16.7,4.4,16.4-6.9,32-19.4,41.3-9.5,7-18.9,12.4-26,22.3-5.4,7.6-8.5,15.5-10.9,23.9,4.2-8.5,10.4-16.2,17.1-22h0Z" />
                  </svg>
                </div>
              )}
              {active === "Information" && (
                <div className="flex gap-5 text-4xl font-black text-[var(--primary)] text-center mt-4 uppercase">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 257.6 130.8"
                    className="fill-[var(--secondary)] w-8 h-auto -scale-x-100"
                  >
                    <path d="M171.5,114.9c-.4-13.6,18-14.3,12.2-15.2-2.6-.4-5-1-7-.5-14.6-10.9-35.6-6.8-52.3-2.6-23.9,6-45.9,17.6-69.5,24.2C23.5,129.5.3,126.4.3,126.4c19.8-1.3,39.1-5.8,55.9-13.1C100.3,94.2,123.8,37.5,88.8,0c14.5,3.5,24.5,23.4,24,37.4-.2,4,5.2,4.2,6.6,1.2,8.1-2.3,12.6,6.3,11.8,14.3-1.7,16.4-19.7,29.1-33.7,33.4-2.9,1.9-.7,6.6,2.6,5.5,41.7-13.4,84.6-51.4,130.7-27.5-5.2-.2-26.1,3.6-27.2,14,.1,2.2,4.1,2.6,5.7,2.6,18.8.4,29.3,18.8,48.3,20.4-5.4,3.2-10.7,6.5-16.7,8.8-16.5,5.8-25.2,0-38-9.7-1.2-.9-4.3-1.6-3.4,1.4,2.3,7.3,4,15.4-.6,22-8.3,13.1-28.3,6.3-27.4-8.9h0Z" />
                    <path d="M17.1,72.5h0c10.8-9.3,32.3-14.9,40.8.5l.3.8c5.8-5.4,5.8-17.5-3.1-19.3,12.1-6.8,16.8-17.2,12.9-30.7-2-7-6.2-12.6-11.7-16.7,4.4,16.4-6.9,32-19.4,41.3-9.5,7-18.9,12.4-26,22.3-5.4,7.6-8.5,15.5-10.9,23.9,4.2-8.5,10.4-16.2,17.1-22h0Z" />
                  </svg>
                  Your guide to the journey
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 257.6 130.8"
                    className="fill-[var(--secondary)] w-8 h-auto "
                  >
                    <path d="M171.5,114.9c-.4-13.6,18-14.3,12.2-15.2-2.6-.4-5-1-7-.5-14.6-10.9-35.6-6.8-52.3-2.6-23.9,6-45.9,17.6-69.5,24.2C23.5,129.5.3,126.4.3,126.4c19.8-1.3,39.1-5.8,55.9-13.1C100.3,94.2,123.8,37.5,88.8,0c14.5,3.5,24.5,23.4,24,37.4-.2,4,5.2,4.2,6.6,1.2,8.1-2.3,12.6,6.3,11.8,14.3-1.7,16.4-19.7,29.1-33.7,33.4-2.9,1.9-.7,6.6,2.6,5.5,41.7-13.4,84.6-51.4,130.7-27.5-5.2-.2-26.1,3.6-27.2,14,.1,2.2,4.1,2.6,5.7,2.6,18.8.4,29.3,18.8,48.3,20.4-5.4,3.2-10.7,6.5-16.7,8.8-16.5,5.8-25.2,0-38-9.7-1.2-.9-4.3-1.6-3.4,1.4,2.3,7.3,4,15.4-.6,22-8.3,13.1-28.3,6.3-27.4-8.9h0Z" />
                    <path d="M17.1,72.5h0c10.8-9.3,32.3-14.9,40.8.5l.3.8c5.8-5.4,5.8-17.5-3.1-19.3,12.1-6.8,16.8-17.2,12.9-30.7-2-7-6.2-12.6-11.7-16.7,4.4,16.4-6.9,32-19.4,41.3-9.5,7-18.9,12.4-26,22.3-5.4,7.6-8.5,15.5-10.9,23.9,4.2-8.5,10.4-16.2,17.1-22h0Z" />
                  </svg>
                </div>
              )}
            </div>
          ) : (
            ""
          )}
        </div>
      </section>
    </div>
  );
}
