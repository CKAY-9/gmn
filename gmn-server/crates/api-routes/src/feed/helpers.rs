use std::{collections::HashMap, time::SystemTime};

use gmn_db::crud::{ post::{ get_post_from_id, get_posts_from_user_id }, user::get_user_from_id };
use gmn_db_schema::models::{ Post, User };
use gmn_utils::iso8601;
use rand::Rng;

fn convert_factor_to_weight_bias(value: f32, max: f32, wght: f32) -> f32 {
    let mut val: f32 = value;
    if val >= max {
        val = max;
    }

    let bias = (val / max) * wght;
    bias
}

fn calculate_weight_bias_for_user(id: i32) -> f32 {
    let user_option = get_user_from_id(id);
    if user_option.is_none() {
        return 0f32;
    }

    let follower_count_bias = 0.1f32;
    let post_count_bias = 0.1f32;
    let today_posts_bias = 0.1f32;

    let user = user_option.unwrap();
    let posts = get_posts_from_user_id(id);
    let followers = user.followers;

    let mut bias: f32 = 0f32;
    bias += convert_factor_to_weight_bias(followers.len() as f32, 10f32, follower_count_bias);
    bias += convert_factor_to_weight_bias(posts.len() as f32, 10f32, post_count_bias);

    let mut today_post_count = 0;
    let today = iso8601::date(iso8601(&SystemTime::now()).as_str()).unwrap();
    for post in posts.iter() {
        let temp_date = &post.date;
        let date_to_iso = iso8601::date(&temp_date);
        if date_to_iso.is_ok() {
            let d = date_to_iso.unwrap();
            if d.to_string() == today.to_string() {
                today_post_count += 1;
            }
        }
    }
    bias += convert_factor_to_weight_bias(today_post_count as f32, 10f32, today_posts_bias);

    bias
}

fn calculate_weight_bias_for_post(post: Post) -> f32 {
    let mut bias = 0f32;
    let likes = post.likes;
    let description = post.description;
    let title = post.title;

    bias += convert_factor_to_weight_bias(likes.len() as f32, 10f32, 0.1f32);
    bias += convert_factor_to_weight_bias(
        (description.len() + title.len()) as f32,
        250f32,
        0.1f32
    );

    //let _today = iso8601::date(iso8601(&SystemTime::now()).as_str()).unwrap();
    //let _date_to_iso = iso8601::date(&post.date).unwrap();
    // TODO: determine date weights

    bias
}

fn get_users_from_weighting(user: &User) -> Vec<i32> {
    let follower_bias: f32 = 1f32 / (user.followers.len() as f32);
    let following_bias: f32 = 2f32 / (user.following.len() as f32);

    let mut initial_biases: HashMap<i32, f32> = HashMap::new();
    for follower in user.followers.iter() {
        initial_biases.insert(*follower, follower_bias);
    }
    for following in user.following.iter() {
        match initial_biases.contains_key(following) {
            true => {
                initial_biases.entry(*following).and_modify(|v| {*v += following_bias});  
            },
            _ => {
                initial_biases.insert(*following, following_bias);
            }
        }
    }

    for u in initial_biases.iter_mut() {
        let weight_add = calculate_weight_bias_for_user(*u.0);
        *u.1 += weight_add;
    }

    println!("Initial user biases: {:?}", initial_biases);

    let mut final_users: Vec<i32> = Vec::new();
    let mut rng = rand::thread_rng();
    let max_user_selection = 15;
    for _ in 0..max_user_selection {
        let rand: f32 = rng.gen();
        for u in initial_biases.iter() {
            if u.1 >= &rand {
                final_users.push(*u.0);
            }
        }
    }

    final_users
}

fn get_posts_from_weighting(users: Vec<i32>) -> Vec<i32> {
    let initial_bias = 0.5f32;
    let mut post_weights: HashMap<i32, f32> = HashMap::new();
    for u in users {
        let ps = get_posts_from_user_id(u);
        let mut w = 0f32;
        for p in ps {
            w = calculate_weight_bias_for_post(p);
        }
        post_weights.insert(u, w + initial_bias);
    }

    let mut final_posts: Vec<i32> = Vec::new();
    let mut rng = rand::thread_rng();
    let max_post_selection = 15;
    for _ in 0..max_post_selection {
        let rand: f32 = rng.gen();
        for p in post_weights.iter() {
            if p.1 >= &rand {
                final_posts.push(*p.0);
                break;
            }
        }
    }

    final_posts
}

pub fn get_user_specific_feed_posts(user: &User) -> Vec<Post> {
    let users = get_users_from_weighting(user);
    println!("Possible users: {:?}", users);
    let posts: Vec<i32> = get_posts_from_weighting(users);
    println!("Posts: {:?}", posts);

    let mut fetched_posts: Vec<Post> = Vec::new();
    for p in posts.iter() {
        let temp_post = get_post_from_id(p.to_owned());
        if temp_post.is_some() {
            fetched_posts.push(temp_post.unwrap());
        }
    }

    fetched_posts
}
