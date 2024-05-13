use actix_web::web;
use gmn_api_routes::user::get::{get_user, login_with_discord};

pub fn configure_api(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api/v1")
            .configure(config_user)
            .configure(config_usergroups)
            .configure(config_exercises) 
            .configure(config_journal)  
    );
}

pub fn config_user(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/user")
            .service(get_user)
            .service(
                web::scope("/auth")
                    .service(login_with_discord)   
            )
    );
}

pub fn config_exercises(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/exercise")
    );
}

pub fn config_journal(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/journal")
    );
}

pub fn config_usergroups(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/usergroup")
    );
}