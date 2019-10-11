var gulp = require('gulp');
var sass = require('gulp-sass');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var browserSync = require('browser-sync').create();

gulp.task('default', function() {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('app/js'));
});

gulp.task('sass', function() {
    return gulp.src('app/sass/**/*.sass')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
});
gulp.task('watch', function() {
    gulp.watch('app/sass/**/*.sass', gulp.series('sass'));
});

gulp.task('serve', function() {
    browserSync.init({
        server: 'app'
    });

    browserSync.watch('app/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev',
    gulp.series('sass', gulp.parallel('watch', 'serve', 'default'))
);