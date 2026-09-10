import contentstack, { QueryOperation } from "@contentstack/delivery-sdk"
import ContentstackLivePreview, { IStackSdk } from "@contentstack/live-preview-utils";
import { Page } from "./types";
import { getContentstackEndpoint, type ContentstackEndpoints } from "@contentstack/utils";

const endpoints = getContentstackEndpoint(import.meta.env.VITE_CONTENTSTACK_REGION || 'NA', '', true) as ContentstackEndpoints

export const stack = contentstack.stack({
  apiKey: import.meta.env.VITE_CONTENTSTACK_API_KEY as string,
  deliveryToken: import.meta.env.VITE_CONTENTSTACK_DELIVERY_TOKEN as string,
  environment: import.meta.env.VITE_CONTENTSTACK_ENVIRONMENT as string,

  // Setting the region
  // for custom or dedicated Contentstack environments, override each endpoint individually using environment variables.
  // You can omit this if you have set a region above. Use @contentstack/utils getContentstackEndpoint to get the right urls for your region.
  region: import.meta.env.VITE_CONTENTSTACK_REGION as any,

  // Setting the host for content delivery based on the region or environment variables
  // for custom or dedicated Contentstack environments, override each endpoint individually using environment variables.
  host: import.meta.env.VITE_CONTENTSTACK_CONTENT_DELIVERY || endpoints.contentDelivery as string,

  live_preview: {
    enable: import.meta.env.VITE_CONTENTSTACK_PREVIEW === 'true',
    preview_token: import.meta.env.VITE_CONTENTSTACK_PREVIEW_TOKEN,
    // Setting the host for live preview based on the region
    // for custom or dedicated Contentstack environments, override each endpoint individually using environment variables.
    host: import.meta.env.VITE_CONTENTSTACK_PREVIEW_HOST || endpoints.preview as string
  }
});

export function initLivePreview() {
  ContentstackLivePreview.init({
    ssr: false,
    enable: import.meta.env.VITE_CONTENTSTACK_PREVIEW === 'true',
    mode: "builder",
    stackSdk: stack.config as IStackSdk,
    stackDetails: {
      apiKey: import.meta.env.VITE_CONTENTSTACK_API_KEY as string,
      environment: import.meta.env.VITE_CONTENTSTACK_ENVIRONMENT as string,
    },
    clientUrlParams: {
      // Setting the client URL parameters for live preview
      // for custom or dedicated Contentstack environments, override each endpoint individually using environment variables.
      host: import.meta.env.VITE_CONTENTSTACK_CONTENT_APPLICATION || endpoints.application as string
    },
    editButton: {
      enable: true,
      exclude: ["outsideLivePreviewPortal"]
    },
  });
}

export async function getPage(url: string) {
  const result = await stack
    .contentType("page")
    .entry()
    .query()
    .where("url", QueryOperation.EQUALS, url)
    .find<Page>();

  if (result.entries) {
    const entry = result.entries[0]

    if (import.meta.env.VITE_CONTENTSTACK_PREVIEW === 'true') {
      contentstack.Utils.addEditableTags(entry, 'page', true);
    }

    return entry;
  }
}