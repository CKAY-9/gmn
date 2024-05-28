use actix_web::web;
use gmn_api_routes::{
    exercise::{
        get::{get_all_exercises, get_exercise},
        post::new_exercise,
    },
    feed::{
        get::{get_explore_posts, get_feed_posts, get_post, get_posts_from_user},
        post::new_post,
    },
    macros::{get::get_macros, put::update_macros_entries},
    user::{
        get::{get_user, login_with_discord, login_with_github},
        post::follow_or_unfollower_user,
        put::{update_personal_reconds, update_user},
    }, workout::{get::get_workout, put::update_workout_entries},
};

pub fn configure_api(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api/v1")
            .configure(config_user)
            .configure(config_usergroups)
            .configure(config_exercises)
            .configure(config_workouts)
            .configure(config_posts)
            .configure(config_macros),
    );
}

pub fn config_user(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/user")
            .service(get_user)
            .service(update_user)
            .service(update_personal_reconds)
            .service(follow_or_unfollower_user)
            .service(
                web::scope("/auth")
                    .service(login_with_discord)
                    .service(login_with_github),
            ),
    );
}

pub fn config_posts(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/feed")
            .service(get_feed_posts)
            .service(get_explore_posts)
            .service(
                web::scope("/post")
                .service(new_post)
                .service(get_post)
                .service(get_posts_from_user)
            ),
    );
}

pub fn config_exercises(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/exercise")
            .service(new_exercise)
            .service(get_exercise)
            .service(get_all_exercises),
    );
}

pub fn config_workouts(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/workout")
            .service(get_workout)
            .service(update_workout_entries),
    );
}

pub fn config_macros(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/macros")
            .service(get_macros)
            .service(update_macros_entries),
    );
}

pub fn config_usergroups(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/usergroup"));
}
