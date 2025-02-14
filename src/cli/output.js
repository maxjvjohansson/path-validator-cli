export function showResults(validPaths, invalidPaths) {
    console.log('\n🔍 Path Validation Results:\n');

    if (validPaths.length > 0) {
        console.log(`✅ ${validPaths.length} valid paths found.`);
    }

    if (invalidPaths.length > 0) {
        console.log(`❌ ${invalidPaths.length} invalid paths found:`);
        invalidPaths.forEach(path => {
            console.log(`   - ${path.path} in ${path.file}`);
        });
    }
}

export function showSummary(errorCount, fixed) {
    console.log('\n📌 Summary:');
    if (errorCount === 0) {
        console.log('✅ No invalid paths found!');
    } else {
        console.log(`❌ ${errorCount} invalid paths remain.`);
        if (fixed) console.log('✔ Paths have been fixed!');
    }
}