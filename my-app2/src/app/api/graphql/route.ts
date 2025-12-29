import { NextRequest, NextResponse } from 'next/server';

// 外部GraphQLサーバーのエンドポイント
const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 
  'https://kadai-post-server-o8swk2av3-instansys.vercel.app/api/graphql';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, variables } = body;

    if (!query) {
      return NextResponse.json(
        { errors: [{ message: 'GraphQL query is required' }] },
        { status: 400 }
      );
    }

    // サーバーサイドからGraphQLリクエストを送信（CORS問題を回避）
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: variables || {},
      }),
      // サーバーサイドからのリクエストなので、CORSの制限はない
      cache: 'no-store',
    });

    if (!response.ok) {
      // 401エラーの場合、認証エラーとして返す
      if (response.status === 401) {
        return NextResponse.json(
          { 
            errors: [{ 
              message: 'GraphQLサーバーが認証を要求しています。サーバーの認証設定を確認してください。',
              details: 'このサーバーはVercelの認証保護が有効になっている可能性があります。'
            }]
          },
          { status: 401 }
        );
      }
      
      let errorText = '';
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = 'レスポンスの読み取りに失敗しました';
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.error('GraphQL server error:', response.status, response.statusText);
      }
      
      return NextResponse.json(
        { 
          errors: [{ 
            message: `GraphQL server error: ${response.status} ${response.statusText}`,
            details: errorText.substring(0, 200) // 長いエラーメッセージを切り詰める
          }]
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // GraphQLエラーをチェック
    if (data.errors) {
      if (process.env.NODE_ENV === 'development') {
        console.error('GraphQL errors:', data.errors);
      }
      // GraphQLエラーは200ステータスで返す（GraphQLの仕様）
      return NextResponse.json(data, { status: 200 });
    }

    // 正常なレスポンスを返す（dataを含む）
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('API route error:', error.message);
    }
    
    return NextResponse.json(
      { 
        errors: [{ 
          message: 'Internal server error',
          details: error.message || 'Unknown error'
        }]
      },
      { status: 500 }
    );
  }
}

// OPTIONSリクエストに対応（CORS preflight）
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

