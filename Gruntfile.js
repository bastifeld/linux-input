module.exports = function(grunt) {

    grunt.initConfig({
    
        watch: {
            
            testing: {
                files: ['lib/coffee/*.coffee', 'test/*.coffee'],
                tasks: ['jasmine_node'],
            },

           /* browserify: {
                files: ["public/js/*.js","!public/js/main.js"],
                tasks: ['browserify:basic'],
            },*/
            
        },


        coffee: {
            glob_to_multiple: {
                expand: true,
                flatten: true,
                cwd: 'lib/coffee/',
                src: ['*.coffee'],
                dest: 'lib/js/',
                ext: '.js'
            }
        },

        jasmine_node: {
            
                useCoffee: true,
                match: '.',
                matchall: true,
                extensions: 'coffee',
                colors: true,
                jUnit: {
                    report: true,
                    savePath : ".",
                    useDotNotation: true,
                    consolidate: true
                }

                /*verbose: true,
                useCoffee: true,
                specNameMatcher: "./spec",
                specFolders: ["test"],
                projectRoot: ".",                
                forceExit: false,
                extensions: "coffee",
                matchall: true*/
            
        },
    });

    
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-jasmine-node');


    grunt.registerTask('test-watch', ['watch']);
    grunt.registerTask('build', ['coffee','jasmine_node']);
    // grunt.registerTask('default', ['watch']);
    // grunt.registerTask('watch', ['watch']);
    grunt.registerTask('default', ['build']);
};