"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clearRequestModel, setRequestModel } from "@/cloudagent/model";
import { useI18n } from "@/core/i18n/hooks";

export function RequestModelSettings() {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [key, setKey] = useState("");
  const [saved, setSaved] = useState(false);
  useEffect(() => clearRequestModel, []);
  return (
    <form className="flex flex-wrap items-end gap-2 border-b px-4 py-2" onSubmit={(event) => {
      event.preventDefault();
      setRequestModel({ name, base_url: url, api_key: key });
      setSaved(true);
    }} onChange={() => setSaved(false)}>
      <label className="text-sm">{t.cloudagent.modelName}<Input required value={name} onChange={e => setName(e.target.value)} autoComplete="off" /></label>
      <label className="min-w-56 flex-1 text-sm">{t.cloudagent.modelURL}<Input required type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com/v1" autoComplete="off" /></label>
      <label className="text-sm">{t.cloudagent.modelKey}<Input required type="password" value={key} onChange={e => setKey(e.target.value)} autoComplete="off" /></label>
      <Button type="submit" variant="outline">{saved ? t.cloudagent.applied : t.cloudagent.apply}</Button>
    </form>
  );
}
