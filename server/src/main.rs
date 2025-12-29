use actix_web::{middleware, web, App, HttpServer};
use actix_cors::Cors;
use async_graphql::{
    EmptySubscription, Object, Schema, SimpleObject, ID, InputObject, Context,
};
use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse};
use chrono::Utc;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};

// データモデル
#[derive(Clone, Debug, Serialize, Deserialize, SimpleObject)]
struct User {
    id: ID,
    name: String,
    #[graphql(name = "avatarUrl")]
    avatar_url: Option<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize, SimpleObject)]
struct Post {
    id: ID,
    title: String,
    body: String,
    author: User,
    tags: Vec<String>,
    #[graphql(name = "publishedAt")]
    published_at: String,
}

// Input型
#[derive(InputObject)]
#[graphql(rename_fields = "camelCase")]
struct CreatePostInput {
    title: String,
    body: String,
    tags: Option<Vec<String>>,
    #[graphql(name = "authorId")]
    author_id: ID,
}

// データストア（メモリ上）
type PostStore = Arc<Mutex<HashMap<String, Post>>>;
type UserStore = Arc<Mutex<HashMap<String, User>>>;

// GraphQL Query
struct Query;

#[Object]
impl Query {
    async fn posts(&self, ctx: &Context<'_>) -> Vec<Post> {
        let store = ctx.data::<PostStore>().unwrap();
        let posts = store.lock().unwrap();
        posts.values().cloned().collect()
    }

    async fn post(&self, ctx: &Context<'_>, id: ID) -> Option<Post> {
        let store = ctx.data::<PostStore>().unwrap();
        let posts = store.lock().unwrap();
        posts.get(id.as_str()).cloned()
    }

    async fn user(&self, ctx: &Context<'_>, id: ID) -> Option<User> {
        let store = ctx.data::<UserStore>().unwrap();
        let users = store.lock().unwrap();
        users.get(id.as_str()).cloned()
    }
}

// GraphQL Mutation
struct Mutation;

#[Object]
impl Mutation {
    #[graphql(name = "createPost")]
    async fn create_post(
        &self,
        ctx: &Context<'_>,
        input: CreatePostInput,
    ) -> Post {
        let post_store = ctx.data::<PostStore>().unwrap();
        let user_store = ctx.data::<UserStore>().unwrap();
        let mut posts = post_store.lock().unwrap();
        let users = user_store.lock().unwrap();

        let id = uuid::Uuid::new_v4().to_string();
        let now = Utc::now();

        // ユーザー情報を取得
        let author = users.get(input.author_id.as_str()).cloned()
            .unwrap_or_else(|| {
                // ユーザーが存在しない場合は、IDから名前を生成
                let name = get_user_name_by_id(input.author_id.as_str());
                User {
                    id: input.author_id.clone(),
                    name,
                    avatar_url: None,
                }
            });

        let post = Post {
            id: ID(id.clone()),
            title: input.title,
            body: input.body,
            author,
            tags: input.tags.unwrap_or_default(),
            published_at: now.to_rfc3339(),
        };

        posts.insert(id, post.clone());
        post
    }
}

// ユーザーIDから名前を取得
fn get_user_name_by_id(id: &str) -> String {
    let user_names: HashMap<&str, &str> = [
        ("user-1", "髙橋慶祐"),
        ("user-2", "佐藤太郎"),
        ("user-3", "鈴木花子"),
        ("user-4", "松本次郎"),
        ("user-5", "後藤優子"),
    ]
    .iter()
    .cloned()
    .collect();

    user_names.get(id).map(|s| s.to_string()).unwrap_or_else(|| id.to_string())
}

// GraphQL Schema
type BlogSchema = Schema<Query, Mutation, EmptySubscription>;

async fn graphql_handler(
    schema: web::Data<BlogSchema>,
    req: GraphQLRequest,
) -> GraphQLResponse {
    schema.execute(req.into_inner()).await.into()
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    
    // 初期データを設定
    let post_store: PostStore = Arc::new(Mutex::new(HashMap::new()));
    let user_store: UserStore = Arc::new(Mutex::new(HashMap::new()));

    // ユーザーデータを初期化
    {
        let mut users = user_store.lock().unwrap();
        users.insert(
            "user-1".to_string(),
            User {
                id: ID("user-1".to_string()),
                name: "髙橋慶祐".to_string(),
                avatar_url: None,
            },
        );
        users.insert(
            "user-2".to_string(),
            User {
                id: ID("user-2".to_string()),
                name: "佐藤太郎".to_string(),
                avatar_url: None,
            },
        );
        users.insert(
            "user-3".to_string(),
            User {
                id: ID("user-3".to_string()),
                name: "鈴木花子".to_string(),
                avatar_url: None,
            },
        );
        users.insert(
            "user-4".to_string(),
            User {
                id: ID("user-4".to_string()),
                name: "松本次郎".to_string(),
                avatar_url: None,
            },
        );
        users.insert(
            "user-5".to_string(),
            User {
                id: ID("user-5".to_string()),
                name: "後藤優子".to_string(),
                avatar_url: None,
            },
        );
    }

    // サンプルデータを追加
    {
        let mut posts = post_store.lock().unwrap();
        let users = user_store.lock().unwrap();
        let id1 = uuid::Uuid::new_v4().to_string();
        let id2 = uuid::Uuid::new_v4().to_string();
        let now = Utc::now();

        let author1 = users.get("user-1").cloned().unwrap();
        let author2 = users.get("user-2").cloned().unwrap();

        posts.insert(
            id1.clone(),
            Post {
                id: ID(id1),
                title: "最初のブログ投稿".to_string(),
                body: "これは最初のブログ投稿の内容です。\n\nGraphQLとReact Queryを使用したミニブログ管理ダッシュボードのサンプルです。".to_string(),
                author: author1,
                tags: vec!["GraphQL".to_string(), "React".to_string()],
                published_at: now.to_rfc3339(),
            },
        );

        posts.insert(
            id2.clone(),
            Post {
                id: ID(id2),
                title: "2番目のブログ投稿".to_string(),
                body: "これは2番目のブログ投稿の内容です。\n\nzodとreact-hook-formを使用したバリデーション機能も実装されています。".to_string(),
                author: author2,
                tags: vec!["TypeScript".to_string(), "React".to_string()],
                published_at: now.to_rfc3339(),
            },
        );
    }

    // GraphQL Schemaを作成
    let schema = Schema::build(Query, Mutation, EmptySubscription)
        .data(post_store)
        .data(user_store)
        .finish();

    println!("GraphQLサーバーを起動しています: http://localhost:8080/api/graphql");

    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .supports_credentials();

        App::new()
            .app_data(web::Data::new(schema.clone()))
            .wrap(cors)
            .wrap(middleware::Logger::default())
            .service(web::resource("/api/graphql").route(web::post().to(graphql_handler)))
            .service(web::resource("/api/graphql").route(web::get().to(graphql_handler)))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
