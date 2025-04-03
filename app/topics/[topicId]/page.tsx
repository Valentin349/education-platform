import VideoPlayer from '@/components/videoPlayer';
import Link from 'next/link';
import { getTopicById } from '@/lib/topics.server';
import BlockNoteWrapper from './components/BlockNoteWrapper';
import { getUserProfile } from '@/lib/user';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, PenTool, Video } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const chapters = [
	{ time: 0, label: "Introduction" },
	{ time: 30, label: "Overview" },
	{ time: 120, label: "Deep Dive" },
	{ time: 240, label: "Conclusion" },
];

export default async function TopicDetailsPage({ params }: { params: Promise<{ topicId: string }> }) {
	const topicId = (await params).topicId;
	const topic = await getTopicById(topicId);
	if (!topic) {
		// deal with error retrieving topic
	}

	const { user, profile } = await getUserProfile();
	if (!user || !profile) {
		// deal with error retrieving user profile
	}

	return (
		<div className="container flex flex-1 flex-col mx-auto py-6 max-w-6xl">
			<div className="mb-8">
				<h1 className="text-3xl font-bold tracking-tight mb-2">{topic.title}</h1>
				<p className="text-muted-foreground text-lg">{topic.description}</p>
			</div>

			<div className="grid gap-6">
				<div className="space-y-6">
					<VideoPlayer videoUrl={topic.video_url} chapters={chapters} />

					<Tabs defaultValue="content">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="content">Content</TabsTrigger>
							<TabsTrigger value="notes">Notes</TabsTrigger>
							<TabsTrigger value="quizzes">Quizzes</TabsTrigger>
						</TabsList>

						<TabsContent value="content" className="space-y-4 mt-4">
							<Card>
								<CardHeader>
									<CardTitle>Math Basics Videos</CardTitle>
									<CardDescription>Watch these videos to learn the fundamentals</CardDescription>
								</CardHeader>
								<CardContent>
									<ul className="space-y-2">
										<li className="flex items-center p-3 hover:bg-slate-50 rounded-md cursor-pointer">
											<div className="flex items-center">
												<Video className="h-5 w-5 mr-3 text-blue-500" />
												<div>
													<p className="font-medium">Natural Numbers</p>
													<p className="text-sm text-muted-foreground">Understanding counting numbers</p>
												</div>
											</div>
											<span className="ml-auto text-sm text-muted-foreground">5:30</span>
										</li>
										<Separator />

										<li className="flex items-center p-3 hover:bg-slate-50 rounded-md cursor-pointer bg-blue-50">
											<div className="flex items-center">
												<Video className="h-5 w-5 mr-3 text-blue-500" />
												<div>
													<p className="font-medium">Integers and Rational Numbers</p>
													<p className="text-sm text-muted-foreground">Working with positive and negative numbers</p>
												</div>
											</div>
											<span className="ml-auto text-sm text-muted-foreground">4:38</span>
										</li>
										<Separator />

										<li className="flex items-center p-3 hover:bg-slate-50 rounded-md cursor-pointer">
											<div className="flex items-center">
												<Video className="h-5 w-5 mr-3 text-blue-500" />
												<div>
													<p className="font-medium">Addition and Subtraction</p>
													<p className="text-sm text-muted-foreground">Basic operations with numbers</p>
												</div>
											</div>
											<span className="ml-auto text-sm text-muted-foreground">7:15</span>
										</li>
										<Separator />

										<li className="flex items-center p-3 hover:bg-slate-50 rounded-md cursor-pointer">
											<div className="flex items-center">
												<Video className="h-5 w-5 mr-3 text-blue-500" />
												<div>
													<p className="font-medium">Multiplication and Division</p>
													<p className="text-sm text-muted-foreground">Advanced operations with numbers</p>
												</div>
											</div>
											<span className="ml-auto text-sm text-muted-foreground">6:20</span>
										</li>
									</ul>
								</CardContent>
								<CardFooter className="flex justify-between border-t pt-4">
									<Button variant="outline">Previous Topic</Button>
									<Button variant="outline">Next Topic</Button>
								</CardFooter>
							</Card>
						</TabsContent>

						{/* Notes tab - BlockNote integration */}
						<TabsContent value="notes" className="mt-4">
							<BlockNoteWrapper topicId={topicId} userRole={profile?.role} />
						</TabsContent>

						<TabsContent value="quizzes" className="mt-4">
							<Card>
								<CardHeader>
									<CardTitle>Math Quizzes</CardTitle>
									<CardDescription>Test your knowledge</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<Card>
											<CardHeader className="pb-2">
												<CardTitle className="text-md">Number Systems Quiz</CardTitle>
												<CardDescription>10 questions • 15 minutes</CardDescription>
											</CardHeader>
											<CardContent className="pb-2">
												<p className="text-sm">Test your understanding of natural numbers, integers, and rational numbers.</p>
											</CardContent>
											<CardFooter>
												<Button className="w-full">
													Start Quiz
													<ExternalLink className="ml-2 h-4 w-4" />
												</Button>
											</CardFooter>
										</Card>

										<Card>
											<CardHeader className="pb-2">
												<CardTitle className="text-md">Basic Operations Quiz</CardTitle>
												<CardDescription>15 questions • 20 minutes</CardDescription>
											</CardHeader>
											<CardContent className="pb-2">
												<p className="text-sm">Test your skills in addition, subtraction, multiplication, and division.</p>
											</CardContent>
											<CardFooter>
												<Button className="w-full">
													Start Quiz
													<ExternalLink className="ml-2 h-4 w-4" />
												</Button>
											</CardFooter>
										</Card>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</div>


			</div>

		</div>
	);

}
