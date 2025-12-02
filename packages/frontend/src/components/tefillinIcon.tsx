import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";

export default function TefilinIcon(props: SvgIconProps) {
    return (
        <SvgIcon
            {...props}
            viewBox="0 0 48 48"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
        >
            <rect x="24" y="10" width="10" height="10" rx="1.5" fill="currentColor" />
            <rect x="12" y="16" width="8" height="8" rx="1.5" fill="currentColor" />
            <rect x="26.5" y="12.5" width="2" height="6" rx="0.5" fill="#fff" opacity="0.4" />
            <rect x="29.5" y="12.5" width="2" height="6" rx="0.5" fill="#fff" opacity="0.4" />
            <rect x="32.5" y="12.5" width="2" height="6" rx="0.5" fill="#fff" opacity="0.4" />
            <path
                d="M 8 35 Q 16 32, 20 35 Q 28 40, 40 35"
                stroke="currentColor"
                strokeWidth="2.2"
                fill="none"
                strokeLinejoin="round"
                strokeLinecap="round"
            />
            <path
                d="M 10 30 Q 12 32, 19 29"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinejoin="round"
                strokeLinecap="round"
            />
            <rect x="20" y="19.5" width="4" height="1.5" rx="0.5" fill="currentColor" />
        </SvgIcon>
    );
}