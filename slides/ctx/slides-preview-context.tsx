"use client";

import { Content } from "@tiptap/core";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  useCallback,
} from "react";
import { fourColumnLayout } from "../layouts";

export interface SlidePreview {
  id: string;
  contentJSON: Content;
}

type SlidesContextType = {
  slidePreviews: SlidePreview[];
  activeSlideId: string | null;
  addSlide: (contentJSON: Content) => void;
  updateSlide: (contentJSON: Content) => void;
  setActiveSlide: (id: string) => void;
  getActiveSlideContent: () => Content;
  deleteSlide: (id: string) => void;
};

const slidesContext = createContext<SlidesContextType | undefined>(undefined);

export const SlidePreviewsProvider = (props: PropsWithChildren) => {
  const [slidePreviews, setSlidePreviews] = useState<SlidePreview[]>([
    {
      id: crypto.randomUUID(),
      contentJSON: {
        type: "doc",
        content: fourColumnLayout.content,
      },
    },
  ]);

  const [activeSlideId, setActiveSlideId] = useState<string | null>(
    slidePreviews[0].id,
  );

  const addSlide = useCallback((contentJSON: Content) => {
    const newSlidePreview: SlidePreview = {
      id: crypto.randomUUID(),
      contentJSON,
    };
    setSlidePreviews((prev) => [...prev, newSlidePreview]);
    setActiveSlideId(newSlidePreview.id);
  }, []);

  const updateSlide = useCallback(
    (contentJSON: Content) => {
      setSlidePreviews((prev) =>
        prev.map((slide) =>
          slide.id === activeSlideId ? { ...slide, contentJSON } : slide,
        ),
      );
    },
    [activeSlideId],
  );

  const setActiveSlide = useCallback((id: string) => {
    setActiveSlideId(id);
  }, []);

  const getActiveSlideContent = useCallback(() => {
    return (
      slidePreviews.find((slide) => slide.id === activeSlideId)?.contentJSON ||
      null
    );
  }, [slidePreviews, activeSlideId]);

  const deleteSlide = useCallback(
    (id: string) => {
      setSlidePreviews((prev) => {
        if (activeSlideId === id && prev.length > 0) {
          setActiveSlideId(prev[0].id);
        }

        return prev.filter((s) => s.id !== id);
      });
    },
    [activeSlideId],
  );

  return (
    <slidesContext.Provider
      value={{
        slidePreviews,
        activeSlideId,
        addSlide,
        updateSlide,
        setActiveSlide,
        getActiveSlideContent,
        deleteSlide,
      }}
    >
      {props.children}
    </slidesContext.Provider>
  );
};

export const useSlidePreviews = () => {
  const ctx = useContext(slidesContext);
  if (!ctx)
    throw new Error("useSlidesContext must be used within SlidesProvider");

  return ctx;
};
