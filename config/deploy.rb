set :application, "For Free, Please"
set :repository,  "git@github.com:jhn/forfreeplease.git"
set :deploy_to, ENV['APP_LOCATION']
set :scm, :git
set :branch, "master"
set :user, "jhn"
set :use_sudo, false
set :rails_env, "production"
set :deploy_via, :copy
set :ssh_options, { :forward_agent => true, :port => ENV['SSH_PORT']}
set :keep_releases, 3

default_run_options[:pty] = true

# set :scm, :git # You can set :scm explicitly or Capistrano will make an intelligent guess based on known version control directory names
# Or: `accurev`, `bzr`, `cvs`, `darcs`, `git`, `mercurial`, `perforce`, `subversion` or `none`

server ENV['SERVER_ADDRESS'], :app, :web, :db, :primary => true # role :web, "162.243.23.71"                          # Your HTTP server, Apache/etc
# role :app, "162.243.23.71"                          # This may be the same as your `Web` server
# role :db,  "your primary db-server here", :primary => true # This is where Rails migrations will run
# role :db,  "your slave db-server here"

# if you want to clean up old releases on each deploy uncomment this:
# after "deploy:restart", "deploy:cleanup"

# if you're still using the script/reaper helper you will need
# these http://github.com/rails/irs_process_scripts

# If you are using Passenger mod_rails uncomment this:
# namespace :deploy do
#   task :start do ; end
#   task :stop do ; end
#   task :restart, :roles => :app, :except => { :no_release => true } do
#     run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
#   end
# end

namespace :mongoid do
  desc "Copy mongoid config"
  task :copy do
    upload "config/mongoid.yml", "#{shared_path}/mongoid.yml", :via => :scp
  end

  desc "Link the mongoid config in the release_path"
  task :symlink do
    run "test -f #{release_path}/config/mongoid.yml || ln -s #{shared_path}/mongoid.yml #{release_path}/config/mongoid.yml"
  end
end

