"use client";

export type RequestModel = { name: string; base_url: string; api_key: string };

// Credentials live only in this tab's memory and are never persisted.
let model: RequestModel | undefined;

export function setRequestModel(value: RequestModel) {
  model = { ...value };
}

export function clearRequestModel() { model = undefined; }

export function getRequestModel(): RequestModel {
  if (!model?.name.trim() || !model.base_url.trim() || !model.api_key) {
    throw new Error("请先填写本次使用的模型名称、地址和密钥");
  }
  return { ...model };
}

export function requestModelHeaders(required = false): Record<string, string> {
  if (!model && !required) return {};
  return { "X-CloudAgent-Model": encodeURIComponent(JSON.stringify(getRequestModel())) };
}
