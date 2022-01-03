import Logo, { LogoProps } from "@components/logo/logo";

interface AstroLogoProps extends LogoProps {
  "client:load"?: boolean;
}

export const AstroLogo = ({ highlight }: AstroLogoProps): JSX.Element => (
  <Logo highlight={highlight} />
);
