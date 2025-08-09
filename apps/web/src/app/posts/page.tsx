'use client';

import Link from 'next/link';
import { Button, Card, CardHeader, CardContent, CardTitle, CardDescription } from '@boilerplate/ui';
import { usePosts } from '@boilerplate/store';

export default function PostsPage() {
  const { data: posts, isLoading, error } = usePosts();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">
            Failed to load posts
          </h1>
          <p className="text-muted-foreground mb-6">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Posts</h1>
            <p className="text-muted-foreground">
              Discover articles and updates from our community
            </p>
          </div>
          <Button>
            Create New Post
          </Button>
        </div>

        {/* Posts Grid */}
        {posts && posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/posts/${post.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {post.content 
                        ? post.content.substring(0, 150) + (post.content.length > 150 ? '...' : '')
                        : 'No content available'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>{post.author?.name || 'Unknown Author'}</span>
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          post.published ? 'bg-green-500' : 'bg-yellow-500'
                        }`} />
                        <span>{post.published ? 'Published' : 'Draft'}</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">No posts found</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to create a post and share your thoughts!
              </p>
              <Button>
                Create First Post
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Load More */}
        {posts && posts.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Load More Posts
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
