import React from "react";
import { Card, CardBody, Typography, Spinner, Button } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import {
	ChatBubbleOvalLeftEllipsisIcon,
	HeartIcon,
	PaperAirplaneIcon,
	PhotoIcon,
	SparklesIcon,
	ClockIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import residentComplexDashboardAPI from "./api";

const fallbackStories = [
	{ id: 1, name: "İdarə", color: "#3b82f6" },
	{ id: 2, name: "Tədbirlər", color: "#10b981" },
	{ id: 3, name: "Xidmətlər", color: "#f59e0b" },
	{ id: 4, name: "Qonşular", color: "#8b5cf6" },
	{ id: 5, name: "Yeniliklər", color: "#ef4444" },
];

const fallbackPosts = [
	{
		id: 1,
		author: "SmartLife İdarə",
		time: "2 saat əvvəl",
		text: "Bu həftəsonu kompleksdə uşaqlar üçün mini festival keçiriləcək. Qeydiyyat açıqdır.",
		likes: 24,
		comments: 8,
	},
	{
		id: 2,
		author: "Texniki xidmət",
		time: "5 saat əvvəl",
		text: "B blokunda lift üçün planlı texniki baxış sabah 11:00-da ediləcək.",
		likes: 11,
		comments: 3,
	},
	{
		id: 3,
		author: "Kompleks xəbərləri",
		time: "1 gün əvvəl",
		text: "Yeni yaşıl zona istifadəyə verildi. Axşam saatlarında giriş açıqdır.",
		likes: 37,
		comments: 15,
	},
];

function normalizeHexColor(value, fallback = "#3b82f6") {
	if (typeof value !== "string") return fallback;
	const cleaned = value.trim().replace("#", "");
	if (!/^[0-9a-fA-F]{6}$/.test(cleaned)) return fallback;
	return `#${cleaned}`;
}

function toRgba(hex, opacity = 1) {
	const cleaned = hex.replace("#", "");
	const r = parseInt(cleaned.substring(0, 2), 16);
	const g = parseInt(cleaned.substring(2, 4), 16);
	const b = parseInt(cleaned.substring(4, 6), 16);
	return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export default function ResidentComplexDashboardPage() {
	const { t } = useTranslation();
	const selectedProperty = useSelector((state) => state.property.selectedProperty);
	const [loading, setLoading] = React.useState(true);
	const [context, setContext] = React.useState({
		complexName: "Kompleks",
		mtkName: "MTK",
		color: "#3b82f6",
	});

	React.useEffect(() => {
		let active = true;

		const run = async () => {
			setLoading(true);
			const properties = await residentComplexDashboardAPI.getMyProperties();

			const sourceProperty =
				selectedProperty ||
				(Array.isArray(properties) && properties.length > 0 ? properties[0] : null);

			const complexName =
				sourceProperty?.sub_data?.complex?.name ||
				sourceProperty?.complex?.name ||
				"Kompleks";
			const mtkName =
				sourceProperty?.sub_data?.mtk?.name ||
				sourceProperty?.mtk?.name ||
				"MTK";
			const complexColor =
				sourceProperty?.sub_data?.complex?.meta?.color_code ||
				sourceProperty?.complex?.meta?.color_code ||
				sourceProperty?.sub_data?.mtk?.meta?.color_code ||
				sourceProperty?.mtk?.meta?.color_code ||
				"#3b82f6";

			if (!active) return;
			setContext({
				complexName,
				mtkName,
				color: normalizeHexColor(complexColor),
			});
			setLoading(false);
		};

		run();
		return () => {
			active = false;
		};
	}, [selectedProperty]);

	if (loading) {
		return (
			<div className="flex items-center justify-center py-12" style={{ position: "relative", zIndex: 0 }}>
				<div className="text-center">
					<Spinner className="h-8 w-8 mx-auto mb-4" />
					<Typography className="text-sm text-gray-500 dark:text-gray-400">
						{t("common.loading") || "Yüklənir..."}
					</Typography>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-5" style={{ position: "relative", zIndex: 0 }}>
			<Card
				className="border dark:border-gray-700 shadow-lg"
				style={{
					borderColor: toRgba(context.color, 0.35),
					background: `linear-gradient(135deg, ${toRgba(context.color, 0.2)}, ${toRgba(context.color, 0.08)})`,
				}}
			>
				<CardBody className="py-4 px-5">
					<Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
						{context.complexName}
					</Typography>
					<Typography variant="small" className="text-gray-700 dark:text-gray-300 mt-1">
						{context.mtkName} • Social Feed
					</Typography>
				</CardBody>
			</Card>

			<Card className="border border-gray-200 dark:border-gray-700 shadow-sm dark:bg-gray-800">
				<CardBody className="py-3 px-4">
					<div className="flex items-center justify-between mb-3">
						<Typography variant="h6" className="text-gray-900 dark:text-white font-bold text-base">
							Stories
						</Typography>
						<ClockIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
					</div>

					<div className="flex items-center gap-3 overflow-x-auto pb-1">
						{fallbackStories.map((story) => {
							const storyColor = story.color || context.color;
							return (
								<div key={story.id} className="flex-shrink-0 text-center w-20">
									<div
										className="mx-auto h-16 w-16 rounded-full p-[2px]"
										style={{ background: `linear-gradient(135deg, ${storyColor}, ${toRgba(storyColor, 0.45)})` }}
									>
										<div className="h-full w-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
											<SparklesIcon className="h-7 w-7" style={{ color: storyColor }} />
										</div>
									</div>
									<Typography variant="small" className="text-[11px] text-gray-700 dark:text-gray-300 mt-1 truncate">
										{story.name}
									</Typography>
								</div>
							);
						})}
					</div>
				</CardBody>
			</Card>

			<div className="space-y-3">
				{fallbackPosts.map((post) => (
					<Card key={post.id} className="border border-gray-200 dark:border-gray-700 shadow-sm dark:bg-gray-800">
						<CardBody className="px-4 py-4">
							<div className="flex items-center justify-between gap-3">
								<Typography variant="small" className="font-bold text-gray-900 dark:text-white">
									{post.author}
								</Typography>
								<Typography variant="small" className="text-xs text-gray-500 dark:text-gray-400">
									{post.time}
								</Typography>
							</div>

							<Typography className="text-sm text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">
								{post.text}
							</Typography>

							<div className="mt-3 flex items-center gap-2">
								<Button variant="text" size="sm" className="flex items-center gap-1 rounded-lg px-2 py-1 text-gray-700 dark:text-gray-300 normal-case">
									<HeartIcon className="h-4 w-4" /> {post.likes}
								</Button>
								<Button variant="text" size="sm" className="flex items-center gap-1 rounded-lg px-2 py-1 text-gray-700 dark:text-gray-300 normal-case">
									<ChatBubbleOvalLeftEllipsisIcon className="h-4 w-4" /> {post.comments}
								</Button>
								<Button variant="text" size="sm" className="flex items-center gap-1 rounded-lg px-2 py-1 text-gray-700 dark:text-gray-300 normal-case">
									<PaperAirplaneIcon className="h-4 w-4" /> Paylaş
								</Button>
							</div>
						</CardBody>
					</Card>
				))}
			</div>

			<Card className="border border-dashed border-gray-300 dark:border-gray-700 dark:bg-gray-800">
				<CardBody className="flex items-center justify-between gap-3 py-4">
					<Typography variant="small" className="font-medium text-gray-700 dark:text-gray-300">
						Story paylaşımı üçün hazırlıq bölməsi
					</Typography>
					<Button size="sm" className="normal-case flex items-center gap-1" style={{ backgroundColor: context.color }}>
						<PhotoIcon className="h-4 w-4" /> Story əlavə et
					</Button>
				</CardBody>
			</Card>
		</div>
	);
}
