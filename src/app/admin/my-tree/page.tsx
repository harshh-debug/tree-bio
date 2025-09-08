import { Button } from "@/components/ui/button";
import { getAllLinkForUser, getPreviewData } from "@/modules/links/actions";
import LinkForm from "@/modules/links/components/LinkForm";
import PreviewFrame from "@/modules/links/components/PreviewFrame";
import ShareMenu from "@/modules/links/components/ShareMenu";

import { getCurrentUsername } from "@/modules/profile/actions";
import { Brush } from "lucide-react";
import React from "react";

const page = async () => {
	const profile = await getCurrentUsername();
	const links = await getAllLinkForUser();
	const previewData = await getPreviewData();
	return (
		<section className="flex flex-col gap-6 px-4 py-6 ">
			<div className="flex flex-row items-center justify-between w-full">
				<div className="flex flex-row justify-center items-center gap-3">
					<Button
						variant="outline"
						size="default"
						className="gap-2 bg-transparent"
					>
						<Brush size={16} />
						Design
					</Button>
					<ShareMenu username={profile?.username!} />
				</div>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start py-14">
				<div className="order-2 lg:order-1 border-r">
					<LinkForm
						username={profile?.username!}
						bio={profile?.bio!}
						//@ts-expect-error
						link={links.data!}
						//@ts-expect-error
						socialLinks={profile?.socialLinks!}
					/>
				</div>
				<div className="order-1 lg:order-2 lg:sticky lg:top-6">
					<PreviewFrame
						links={previewData.data.map((link: any) => ({
							...link,
							description:
								link.description === null ? undefined : link.description,
						}))}
					/>
				</div>
			</div>
		</section>
	);
};

export default page;
