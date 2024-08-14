import { CheckCircleIcon } from "@heroicons/react/16/solid";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";

interface ConfirmProps {
    text: string;
}

export default function Confirm({ text }: ConfirmProps) {
    return (
        <div
            className="flex items-center justify-center p-2 bg-green-500 rounded-lg disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed"
        >
            <CheckBadgeIcon className="h-6 w-6 text-white text-gray-400" />
            {text}
        </div>
    );
}
