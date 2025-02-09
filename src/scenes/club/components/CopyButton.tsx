import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { Copy } from "lucide-react";

export default function CopyButton() {
  const [copiedText, copyToClipboard] = useCopyToClipboard();
  
  return (
    <Button
      variant="secondary"
      onClick={() => copyToClipboard(window.location.href)}
    >
      <Copy className="mr-2 inline-block h-5 w-5" />
      {copiedText ? "Copié !" : "Copier le lien"}
    </Button>
  );
}