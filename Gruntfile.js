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
                        src: './node_modules/bootstrap/dist/css/bootstrap.min.css',
                        dest: 'public/css/'
                    }
                ]
            }
        },

        clean: {
            src: ['./public/js/build/production.js', './public/js/build/production.min.js'],
        }

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.registerTask('release', ['clean', 'copy:main', 'concat', 'uglify', 'imagemin']);
    grunt.registerTask('dev_build', ['clean', 'copy:main', 'concat', 'imagemin']);
    grunt.registerTask('default', ['watch']);

};
