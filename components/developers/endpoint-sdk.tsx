"use client";

import { CodeBlock } from "@/components/developers/code-block";
import { setSdkLang, useSdkLang } from "@/components/developers/sdk-lang";
import { roveTabs } from "@/components/ui/tablist";
import {
  SDK_FILE,
  SDK_LABEL,
  SDK_LANGS,
  renderSdk,
  type SdkCall,
} from "@/components/developers/sdk-samples";

/* The same call through an SDK, under the cURL for every endpoint.

   "How do I do that from Laravel" was the next question every time, and the
   answer used to be a separate page with four samples on it that had nothing
   to do with the endpoint you were reading. The language is shared across the
   page, so picking Go once picks it everywhere. */
export function EndpointSdk({ call, path }: { call: SdkCall; path: string }) {
  const lang = useSdkLang();

  return (
    <div className="min-w-0">
      <div
        role="tablist"
        aria-label={`SDK language for ${path}`}
        className="mb-2 flex flex-wrap gap-1"
        onKeyDown={(e) =>
          roveTabs(e, SDK_LANGS.length, SDK_LANGS.indexOf(lang), (n) =>
            setSdkLang(SDK_LANGS[n]),
          )
        }
      >
        {SDK_LANGS.map((l) => (
          <button
            key={l}
            type="button"
            role="tab"
            aria-selected={lang === l}
            tabIndex={lang === l ? 0 : -1}
            onClick={() => setSdkLang(l)}
            className={`inline-flex min-h-11 items-center rounded-full px-3 text-[12px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
              lang === l
                ? "bg-brand-soft text-brand"
                : "text-muted hover:bg-bone hover:text-ink"
            }`}
          >
            {SDK_LABEL[l]}
          </button>
        ))}
      </div>

      <CodeBlock
        code={renderSdk(lang, call)}
        label={SDK_FILE[lang]}
        copyLabel={`Copy the ${SDK_LABEL[lang]} sample for ${path}`}
      />
    </div>
  );
}
