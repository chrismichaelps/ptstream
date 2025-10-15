import { useImperativeHandle, forwardRef } from "react";
import { Helmet } from "react-helmet";

export interface SeoContainerRef {
  updateTitle: (title: string) => void;
  updateDescription: (description: string) => void;
  updateKeywords: (keywords: string) => void;
  updateCanonical: (canonical: string) => void;
  getCurrentTitle: () => string;
  getCurrentDescription: () => string | undefined;
  getCurrentKeywords: () => string | undefined;
  getCurrentCanonical: () => string | undefined;
}

type SEOProps = {
  title: string;
  description?: string;
  keywords?: string;
  canonical?: string;
};

const SeoContainer = forwardRef<SeoContainerRef, SEOProps>(
  ({ title, description, keywords, canonical }, ref) => {
    const updateTitle = (newTitle: string) => {
      // This would need to be handled by the parent component
      console.log("Title update requested:", newTitle);
    };

    const updateDescription = (newDescription: string) => {
      console.log("Description update requested:", newDescription);
    };

    const updateKeywords = (newKeywords: string) => {
      console.log("Keywords update requested:", newKeywords);
    };

    const updateCanonical = (newCanonical: string) => {
      console.log("Canonical update requested:", newCanonical);
    };

    const getCurrentTitle = () => title;
    const getCurrentDescription = () => description;
    const getCurrentKeywords = () => keywords;
    const getCurrentCanonical = () => canonical;

    useImperativeHandle(
      ref,
      () => ({
        updateTitle,
        updateDescription,
        updateKeywords,
        updateCanonical,
        getCurrentTitle,
        getCurrentDescription,
        getCurrentKeywords,
        getCurrentCanonical,
      }),
      [title, description, keywords, canonical]
    );

    return (
      <Helmet>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        {keywords && <meta name="keywords" content={keywords} />}
        {canonical && <link rel="canonical" href={canonical} />}
      </Helmet>
    );
  }
);

SeoContainer.displayName = "SeoContainer";

export default SeoContainer;
