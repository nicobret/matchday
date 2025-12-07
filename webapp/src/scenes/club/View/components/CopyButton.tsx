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
      <Copy />
      {copiedText ? "Copié !" : "Copier le lien"}
    </Button>
  );
}
