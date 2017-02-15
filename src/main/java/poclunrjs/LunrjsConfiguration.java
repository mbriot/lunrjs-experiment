package poclunrjs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.ehcache.EhCacheCacheManager;
import org.springframework.cache.ehcache.EhCacheManagerFactoryBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.core.io.ClassPathResource;

@Configuration
@EnableCaching
@PropertySource("classpath:application.properties")
@ComponentScan(basePackageClasses = ApplicationController.class)
public class LunrjsConfiguration {

    @Autowired
    Environment env;

    @Bean
    SparkowRequester sparkowRequester(){
		SparkowRequester sparkowRequester = new SparkowRequester(env.getProperty("sparkow.host"));
		boolean isProxyUsed = Boolean.parseBoolean(env.getProperty("proxy.use"));
		sparkowRequester.setIsProxyUsed(isProxyUsed);
		if (isProxyUsed) {
			sparkowRequester.setProxyHost(env.getProperty("proxy.host"));
			sparkowRequester.setProxyPort(Integer.parseInt(env.getProperty("proxy.port")));
			sparkowRequester.setProxyUsername(env.getProperty("proxy.username"));
			sparkowRequester.setProxyPassword(env.getProperty("proxy.password"));
		}
        return sparkowRequester;
    }

    @Bean
    Categories categories() {
        return new Categories(sparkowRequester());
    }

    @Bean
    public CacheManager cacheManager() {
        return new EhCacheCacheManager(ehCacheCacheManager().getObject());
    }

    @Bean
    public EhCacheManagerFactoryBean ehCacheCacheManager() {
        EhCacheManagerFactoryBean cmfb = new EhCacheManagerFactoryBean();
        cmfb.setConfigLocation(new ClassPathResource("ehcache.xml"));
        cmfb.setShared(true);
        return cmfb;
    }

}
