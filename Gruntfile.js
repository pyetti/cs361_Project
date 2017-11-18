module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dist: {
                src: [
                    'public/js/*.js',
                    'public/js/global.js'
                ],
                dest: 'public/js/build/production.js',
            }
        },
        uglify: {
           build: {
               src: 'public/js/build/production.js',
               dest: 'public/js/build/production.min.js'
            }
        },
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'public/images/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'public/images/build/'
               }]
           }
        },
        watch: {
            scripts: {
                files: ['public/js/*.js'],
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false,
                },
            }
        },

        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        filter: 'isFile',
                        src: 'node_modules/bootstrap/dist/css/bootstrap.min.css',
                        dest: 'public/css/'
                    }
                ]
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask('build', ['concat', 'uglify', 'imagemin', 'copy']);
    grunt.registerTask('run', ['watch']);

};
