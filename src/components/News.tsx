import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { normalizeImagePaths } from "../utils/news";
import type { NewsItemLang, NewsJson } from "../utils/news";

type NewsItem = Omit<NewsItemLang, "image"> & {
  id: string;
  idNum: number;
  image?: string;
};

const getLang = (lng?: string): "ro" | "ru" | "en" => {
  if (!lng) return "ro";
  if (lng.startsWith("ru")) return "ru";
  if (lng.startsWith("en")) return "en";
  return "ro";
};

const News = () => {
  const { t, i18n } = useTranslation(undefined, { keyPrefix: "news" });
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/data/news.json", { cache: "no-store" });
        const data = (await res.json()) as NewsJson;

        const lang = getLang(i18n.resolvedLanguage || i18n.language);
        const items: NewsItem[] = Object.entries(data)
          .map(([id, value]) => {
            const content = value[lang] ?? value["en"];
            return {
              id,
              idNum: Number(id),
              ...content,
              image: normalizeImagePaths(content.image)[0],
            };
          })
          .sort((a, b) => a.idNum - b.idNum); // oldest→newest

        const lastItems = items.slice(-3).reverse(); // newest three
        setNews(lastItems);
      } catch (err) {
        console.error("Error loading news.json", err);
      }
    };

    fetchNews();
  }, [i18n.resolvedLanguage, i18n.language]);

  return (
    <section className="grid grid-cols-full">
      <div className="flex justify-between items-baseline col-span-full mt-14">
        <h2 className="text-2xl">{t("header")}</h2>
        <Link to="/news" className="text-[#1447E6] cursor-pointer">
          {t("allNews")}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 col-span-full">
        {news.map((item) => (
          <Link
            to={`/news/${item.id}`}
            key={item.id}
            className="col-span-1 rounded-2xl small-shadow"
          >
            {item.image ? (
              <img
                className="rounded-t-2xl w-full h-48 object-cover"
                src={item.image}
                alt={item.title}
              />
            ) : (
              <div className="h-48 rounded-t-2xl bg-[#f1f1f1]" aria-hidden="true" />
            )}
            <div className="p-4">
              <div className="flex gap-1 items-center">
                <span className="text-xs text-[#3F3F40]">{item.data} •</span>
                <span className="text-xs rounded-full border-[1px] border-[#BEDBFF] text-[#145EEC] py-1 px-3">
                  {item.tag}
                </span>
              </div>
              <h3 className="mt-3 mb-4 line-clamp-2">{item.title}</h3>
              <p className="text-[#3F3F40] line-clamp-3 mb-4">{item.text}</p>
              <p className="text-[#145EEC]">{t("read")}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default News;
