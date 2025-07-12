import { Router } from 'express';
import { postQueries, postMutations } from '@boilerplate/database';
import type { CreatePostInput, UpdatePostInput } from '@boilerplate/database';

const router = Router();

// GET /api/posts - Get all posts
router.get('/', async (req, res) => {
  try {
    const { skip = 0, take = 10, published = 'true' } = req.query;
    const posts = await postQueries.findMany(
      Number(skip),
      Number(take),
      published === 'true'
    );
    const total = await postQueries.count(published === 'true');
    
    res.json({
      success: true,
      data: posts,
      pagination: {
        skip: Number(skip),
        take: Number(take),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch posts',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET /api/posts/search - Search posts
router.get('/search', async (req, res) => {
  try {
    const { q, skip = 0, take = 10 } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Query parameter "q" is required',
      });
    }

    const posts = await postQueries.search(q, Number(skip), Number(take));
    
    res.json({
      success: true,
      data: posts,
      query: q,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to search posts',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET /api/posts/:id - Get post by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postQueries.findById(id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }
    
    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch post',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// POST /api/posts - Create new post
router.post('/', async (req, res) => {
  try {
    const postData: CreatePostInput = req.body;
    
    // Basic validation
    if (!postData.title || !postData.authorId) {
      return res.status(400).json({
        success: false,
        error: 'Title and authorId are required',
      });
    }
    
    const post = await postMutations.create(postData);
    
    res.status(201).json({
      success: true,
      data: post,
      message: 'Post created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create post',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// PUT /api/posts/:id - Update post
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData: UpdatePostInput = req.body;
    
    const post = await postMutations.update(id, updateData);
    
    res.json({
      success: true,
      data: post,
      message: 'Post updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update post',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// DELETE /api/posts/:id - Delete post
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await postMutations.delete(id);
    
    res.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete post',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// POST /api/posts/:id/publish - Publish post
router.post('/:id/publish', async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await postMutations.publish(id);
    
    res.json({
      success: true,
      data: post,
      message: 'Post published successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to publish post',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// POST /api/posts/:id/unpublish - Unpublish post
router.post('/:id/unpublish', async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await postMutations.unpublish(id);
    
    res.json({
      success: true,
      data: post,
      message: 'Post unpublished successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to unpublish post',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export { router as postsRouter };
