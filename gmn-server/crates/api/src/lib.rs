use actix_web::web;
use gmn_api_routes::{
    feed::{ get::{get_explore_posts, get_feed_posts, get_post}, post::new_post },
    macros::{ get::get_macros, put::update_entries },
    user::{ get::{ get_user, login_with_discord }, put::{ update_personal_reconds, update_user } },
};

pub fn configure_api(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web
            ::scope("/api/v1")
            .configure(config_user)
            .configure(config_usergroups)
            .configure(config_exercises)
            .configure(config_journal)
            .configure(config_macros)
    );
}

pub fn config_user(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web
            ::scope("/user")
            .service(get_user)
            .service(update_user)
            .service(update_personal_reconds)
            .service(web::scope("/auth").service(login_with_discord))
    );
}

pub fn config_posts(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web
            ::scope("/feed")
            .service(get_feed_posts)
            .service(get_explore_posts)
            .service(web
                ::scope("/post")
                .service(new_post))
                .service(get_post)
    );
}

pub fn config_exercises(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/exercise"));
}

pub fn config_journal(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/journal"));
}

pub fn config_usergroups(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/usergroup"));
}

pub fn config_macros(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/macros").service(get_macros).service(update_entries));
}
