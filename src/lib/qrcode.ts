import QRCode from "qrcode";

export async function generateQRCode(lotId: string, lotNumber: string): Promise<string> {
  const data = JSON.stringify({
    lotId,
    lotNumber,
    url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/trace/${lotId}`,
    generatedAt: new Date().toISOString(),
  });

  return QRCode.toDataURL(data, {
    width: 300,
    margin: 2,
    color: { dark: "#1a1a2e", light: "#ffffff" },
  });
}
