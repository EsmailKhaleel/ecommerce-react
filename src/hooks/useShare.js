import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export default function useShare({ title, text }) {
  const { t } = useTranslation();

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title,
        text,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success(t("common.linkCopied"));
    }
  };

  return {
    handleShare,
  };
  
}
