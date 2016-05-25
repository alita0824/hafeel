
module.exports = function(grunt) {
    'use strict';

    grunt.util.linefeed = '\n';

    RegExp.quote = function(string) {
        return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
    };

    var HLConfig = {
        staticPort : 9000,
        css : {
            pc : [
                '<%= meta.srcPath %>css/reset.css',
                '<%= meta.srcPath %>css/common.css',
                '<%= meta.srcPath %>css/index.css',
                '<%= meta.srcPath %>css/access.css',
                '<%= meta.srcPath %>css/login.css',
                '<%= meta.srcPath %>css/product.css'
            ]
        },
        js : {
            pc : []
        }
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        meta: {
            assetPath: 'src/assets/',
            distPath: 'dist/',
            jsPath: 'src/js/',
            cssPath: 'src/css/',
            srcPath: "src/"
        },

        banner: '/*!\n' +
        ' * =====================================================\n' +
        ' * hafeel v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
        ' * =====================================================\n' +
        ' */\n',

        clean: {
            all: ['<%= meta.distPath %>'],
            sourceMap: ['<%= meta.distPath %>css/*.map']
        },

        /**
         * 启动静态文件的服务器
         */
        connect: {
            distServer : {
                options: {
                    open: true,
                    protocol : "http",
                    port: HLConfig.staticPort + 1,
                    hostname: '127.0.0.1',
                    livereload: 35730,
                    base: ['dist']
                }
            },
            srcServer : {
                options: {
                    open: true,
                    protocol : "http",
                    port: HLConfig.staticPort,
                    hostname: '127.0.0.1',
                    livereload: 35729,
                    base: ['src']
                }
            }
        },

        useminPrepare: {
            html: ['src/**/*.html','src/m/*.html'],
            options: {
                dest: '<%= meta.distPath %>',
                flow : {
                    html : {
                        steps : {
                            css :[''],
                            js : ['']
                        },
                        post : {

                        }
                    }
                }
            }
        },

        /**
         * 合并文件
         */
        concat: {
            js: {
                options: {
                    banner: '<%= banner %>'
                },
                src: [
                    '<%= meta.srcPath %>js/*.js'
                ],
                dest: '<%= meta.distPath %>js/all.js'
            },
            css: {
                options: {
                    banner: '<%= banner %>'
                },
                src: HLConfig.css.pc,
                dest: '<%= meta.distPath %>css/all.css'
            }
        },

        /**
         * 复制文件
         */
        copy: {
            main : {
                files : [{
                    //复制字体
                    expand: true,
                    cwd: '<%= meta.srcPath %>',
                    src: 'fonts/**/*',
                    dest: '<%= meta.distPath %>/'
                },{
                    //复制第三方插件
                    expand: true,
                    cwd: '<%= meta.srcPath %>',
                    src: 'assets/**/*',
                    dest: '<%= meta.distPath %>/'
                }, {
                    //复制PChtml文件
                    expand: true,
                    cwd: '<%= meta.srcPath %>',
                    src: '*.html',
                    dest: '<%= meta.distPath %>/'
                },
                    {
                        //复制图像文件
                        expand: true,
                        cwd: '<%= meta.srcPath %>',
                        src: 'img/**/*',
                        dest: '<%= meta.distPath %>/'
                    }, {
                        //复制js文件
                        expand: true,
                        cwd: '<%= meta.srcPath %>',
                        src: ['js/*.js'],
                        dest: '<%= meta.distPath %>/'
                    }]
            }
        },

        /**
         * 压缩css
         */
        cssmin: {
            options: {
                banner: '',
                keepSpecialComments: '*',
                sourceMap: false
            },
            css: {
                files: [
                    {
                        src: '<%= meta.distPath %>css/all.css',
                        dest: '<%= meta.distPath %>css/all.min.css'
                    }
                ]
            }
        },

        /**
         * 压缩js
         */
        uglify: {
            options: {
                banner: '<%= banner %>',
                compress: true,
                mangle: true,
                preserveComments: false
            },
            sure: {
                src: '<%= concat.js.dest %>',
                dest: '<%= meta.distPath %>js/all.min.js'
            }
        },
        /**
         * 压缩图片大小
         */
        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 3 //定义 PNG 图片优化水平
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= meta.srcPath %>img/',
                        src: ['**/*.{png,jpg,jpeg}'], // 优化 img 目录下所有 png/jpg/jpeg 图片
                        dest: '<%= meta.distPath %>img/' // 优化后的图片保存位置，覆盖旧图片，并且不作提示
                    }
                ]
            }
        },

        /**
         * 监听文件
         */
        watch: {
            options: {
                dateFormat: function(time) {
                    grunt.log.writeln('The watch finished in ' + time + 'ms at' + (new Date()).toString());
                    grunt.log.writeln('Waiting for more changes...');
                },
                livereload: true
            },
            scripts: {
                files: [
                    '<%= meta.cssPath %>/**/*.css',
                    '<%= meta.jsPath %>/**/*.js',
                    '<%= meta.srcPath %>*.html',
                ],
                tasks: 'dist'
            },
            livereload: {
                options: {
                    livereload: '<%=connect.options.srcServer.livereload%>'
                },

                files: [
                    'dist/*.html',
                    'dist/css/{,*/}*.css',
                    'dist/js/{,*/}*.js',
                    'dist/img/{,*/}*.{png,jpg}'
                ]
            }
        },

        /**
         * 替换压缩之后的文件
         */
        usemin: {
            html: ['<%= meta.distPath %>/*.html'],
            options: {
                assetsDirs: ['<%= meta.distPath %>/css']
            }
        },

        /**
         *  格式化和清理html文件
         */
        htmlmin: {
            html: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true //压缩html:根据情况开启与否
                },

                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: ['*.html'],
                    dest: 'dist/'
                },{
                    expand: true,
                    cwd: 'dist/m/',
                    src: ['*.html'],
                    dest: 'dist/m/'
                }]
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 2 versions', 'ie 8', 'ie 9']
            },
            css: {
                    expand: true,
                    cwd: '<%= meta.cssPath %>/',
                    src: ['**/*.css'],
                    dest: '<%= meta.cssPath %>/'
                }
        },
        csslint:{
            options:{
                csslintrc:"./.csslintrc"
            },
            build:["<%= meta.cssPath %>/*.css"]
        },
        csscomb: {
            options: {
            },
            css: {
                expand: true,
                cwd: '<%= meta.cssPath %>/',
                src: ['**/*.css'],
                dest: '<%= meta.cssPath %>/'
            }
        }
    });

    require('load-grunt-tasks')(grunt, {
        scope: 'devDependencies'
    });
    require('time-grunt')(grunt);

    grunt.registerTask('css', ['autoprefixer', 'csscomb', 'csslint']);

    grunt.registerTask('cleanAll', ['clean']);
    grunt.registerTask('compile-css', ['cssmin', 'clean:sourceMap']);
    grunt.registerTask('compile-js', ['concat', 'uglify']);
    grunt.registerTask('compile', ['clean:all', 'useminPrepare', 'compile-js', 'compile-css', 'copy', 'usemin']);
    grunt.registerTask('build2',['clean', 'concat','copy', 'cssmin', 'usemin']);
    grunt.registerTask('default', ['build2']);

    grunt.event.on('watch', function(action, filepath, target) {
        grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    });
};
