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
               src: 'js/build/production.js',
               dest: 'js/build/production.min.js'
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
        }   

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.registerTask('default', ['concat', 'uglify', 'imagemin']);

};
