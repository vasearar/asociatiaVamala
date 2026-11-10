"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type Localized = Record<string, string>;

interface RawMember {
  name?: Localized | string;
  role?: Localized | string;
  image?: string;
  type?: string;
}

interface RawJson {
  [key: string]: unknown;
}

interface Member {
  name: string;
  role: string;
  image: string;
  type: "consilium" | "members";
}

const pickLocalized = (lang: string, value?: Localized | string): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  const short = lang?.split("-")[0]?.toLowerCase() || "en";
  return value[short] || value.en || Object.values(value)[0] || "";
};

const normalizeType = (t?: string): "consilium" | "members" | "" => {
  const v = (t || "").trim().toLowerCase();
  if (v === "consilium") return "consilium";
  if (v === "member" || v === "members") return "members";
  return "";
};

const MemberCard = ({
  name,
  role,
  imageSrc,
  roleClass = "text-[#3F3F40] text-sm",
}: {
  name: string;
  role: string;
  imageSrc?: string;
  roleClass?: string;
}) => {
  const [imgError, setImgError] = useState(false);
  const showFallback = !imageSrc || imgError;

  const initials = useMemo(() => {
    const parts = (name || "").trim().split(/\s+/).filter(Boolean);
    const chars = (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
    return (chars || "?").toUpperCase();
  }, [name]);

  return (
    <div className="small-shadow rounded-2xl p-4 sm:p-5 col-span-8 sm:col-span-6 lg:col-span-4">
      <div className="flex items-center gap-4">
        {showFallback ? (
          <div
            className="size-14 sm:size-16 shrink-0 aspect-square rounded-full small-shadow border-[1px] border-[#3A47EA] bg-[#3A47EA] text-white flex items-center justify-center text-base sm:text-lg font-semibold select-none"
            aria-label={name || "Member avatar"}
            role="img"
          >
            {initials}
          </div>
        ) : (
          <div className="size-14 sm:size-16 shrink-0 aspect-square overflow-hidden rounded-full small-shadow border-[1px] border-[#3A47EA]">
            <img
              className="size-full object-cover object-top"
              src={imageSrc}
              alt={name}
              onError={() => setImgError(true)}
            />
          </div>
        )}

        <div className="flex flex-col">
          <p className="text-sm sm:text-base">{name}</p>
          <span className={roleClass}>{role}</span>
        </div>
      </div>
    </div>
  );
};

const Members = () => {
  const { t, i18n } = useTranslation(undefined, { keyPrefix: "members" });

  const [members, setMembers] = useState<Member[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const res = await fetch("/data/members.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: RawJson = await res.json();
        const container = (json as any).members ?? json;

        const items: Member[] = Object.entries(container)
          .map(([, value]) => {
            const v = value as RawMember;
            const type = normalizeType(v?.type);
            if (!type) return null;
            const name = pickLocalized(i18n.language, v?.name);
            const role = pickLocalized(i18n.language, v?.role);
            const image = (v?.image || "").trim();
            if (!name) return null;
            return { name, role, image, type } as Member;
          })
          .filter(Boolean) as Member[];

        if (isMounted) setMembers(items);
      } catch (e: any) {
        if (isMounted) setError(e?.message || "Failed to load members.json");
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [i18n.language]);

  const consilium = (members || []).filter((m) => m.type === "consilium");
  const founders = (members || []).filter((m) => m.type === "members");

  return (
    <section className="grid grid-cols-full w-full gap-y-5 sm:gap-y-6">
      <div className="col-span-full mt-32">
        <h1 className="text-2xl">{t("header")}</h1>
        <h2 className="text-[#3F3F40] text-sm sm:text-base">
          {t("subHeader")}
        </h2>
      </div>

      {consilium.length > 0 && (
        <>
          <h1 className="col-span-full text-lg sm:text-xl mt-6 sm:mt-8 mb-3 sm:mb-4">
            {t("consilium")}
          </h1>
          {consilium.map((m, idx) => (
            <MemberCard
              key={`consilium-${idx}-${m.name}`}
              name={m.name}
              role={m.role}
              imageSrc={m.image}
              roleClass="text-[#3A47EA] text-sm"
            />
          ))}
        </>
      )}

      {founders.length > 0 && (
        <>
          <h1 className="col-span-full text-lg sm:text-xl mt-6 sm:mt-8 mb-3 sm:mb-4">
            {t("founders")}
          </h1>
          {founders.map((m, idx) => (
            <MemberCard
              key={`founders-${idx}-${m.name}`}
              name={m.name}
              role={m.role}
              imageSrc={m.image}
            />
          ))}
        </>
      )}
      {error && (
        <p className="col-span-full text-xs text-red-600 opacity-70">{error}</p>
      )}
    </section>
  );
};

export default Members;
