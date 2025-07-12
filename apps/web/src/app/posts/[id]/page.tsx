'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, CardHeader, CardContent, CardTitle, CardDescription } from '@boilerplate/ui';
import { usePost } from '@boilerplate/store';

export default function PostDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: post, isLoading, error } = usePost(id);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">
            Post not found
          </h1>
          <p className="text-muted-foreground mb-6">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/posts">
            <Button>
              Back to Posts
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-muted-foreground">/</span>
                <Link href="/posts" className="text-muted-foreground hover:text-foreground">
                  Posts
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2 text-muted-foreground">/</span>
                <span className="text-foreground font-medium">
                  {post.title.length > 30 ? post.title.substring(0, 30) + '...' : post.title}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Post Header */}
        <Card className="mb-8">
          <CardHeader className="pb-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-4">
                  {post.title}
                </CardTitle>
                <CardDescription className="text-lg">
                  By {post.author?.name || 'Unknown Author'}
                </CardDescription>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                post.published 
                  ? 'bg-green-100 text-green-800 border border-green-300' 
                  : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
              }`}>
                {post.published ? 'Published' : 'Draft'}
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Created: {new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="text-sm text-muted-foreground">
                Updated: {new Date(post.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Post Content */}
        <Card className="mb-8">
          <CardContent className="prose prose-lg max-w-none p-8">
            {post.content ? (
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {post.content}
              </div>
            ) : (
              <p className="text-muted-foreground italic text-center py-8">
                No content available for this post.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>
                Manage this post
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full">
                Edit Post
              </Button>
              <Button variant="outline" className="w-full">
                Share Post
              </Button>
              <Button variant="destructive" className="w-full">
                Delete Post
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Author</CardTitle>
              <CardDescription>
                About the author
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                {post.author?.avatar && (
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.name || 'Author'} 
                    className="w-12 h-12 rounded-full"
                  />
                )}
                <div>
                  <h4 className="font-semibold">{post.author?.name || 'Unknown Author'}</h4>
                  <p className="text-sm text-muted-foreground">{post.author?.email}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                View Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Related Posts */}
        <Card>
          <CardHeader>
            <CardTitle>More from {post.author?.name}</CardTitle>
            <CardDescription>
              Other posts by this author
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Related posts feature coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
