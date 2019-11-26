/**
 * 
 * 负载均衡：
 * http{
 *      ...
 *      upstream serverName{
 *          server 192.68.17.222:9001;
 *          server 192.68.17.222:9002;
 *      }
 *      server{
 *          ...
 *          location / {
 *              proxy_pass http://serverName;
 *              proxy_connect_timeout 10;
 *          }
 *      }
 * }
 * 
 * 负载均衡的几种方式:
 * 方式一：轮询
 *      每个请求按时间逐一分配不同后台服务器，如果出现服务器down掉，自动剔除。
 * 方式二：weight
 *      权重
 *      upstream serverName{
 *          server 192.68.17.222:9001 weight=10;
 *          server 192.68.17.222:9002 weight=10;
 *      }
 * 方式三：ip_hash
 *      每个访客固定一个服务器（通过hash分配），可以解决session问题
 *      upstream serverName{
 *          ip_hash
 *          server 192.68.17.222:9001;
 *          server 192.68.17.222:9002;
 *      }
 * 方式四：fair
 *      按后端服务器的响应时间来分配请求，响应时间越短的优先分配。
 *      upstream serverName{
 *          server 192.68.17.222:9001;
 *          server 192.68.17.222:9002;
 *          fair
 *      }
 * 
 * 
 * 动静分离--www和image都是放静态资源，其他动态资源走tomcat
 * server{
 *      listen          80;
 *      server_name     192.168.17.222;
 * 
 *      #charset koi8-r;
 * 
 *      #access_log     logs/host.access.log    main
 * 
 *      location /www/    {
 *          root            /data/;                     //不知道是www的上一个目录还是根目录
 *          index           index.html index.htm;
 *      }
 * 
 *      location /image/    {
 *          root            /data/;
 *          autoindex       on;                         //230暴露的elementui那样，可以浏览文件
 *      }
 * }
 * 
 * 
 * 高可用：--  防治Nginx代理服务器宕机，导致连不上服务器   keepalived
 *      使用多个Nginx服务器（master，backup）
 *      https://www.jianshu.com/p/78b6a61531a1   
 * 
 * 
 * session共享问题：
 *       原因：由于tomcat1，tomcat2部署了同一个工程，如果有数据直接存在于session，而nginx会负载均衡到随机的服务器上 。如果在刷新页面时跳转到另外一个服务器，之前的服务器上的session则会消失，导致数据丢失。
 *        解决方式1:
 *                只能在windows下好使
 *                web服务器解决(广播机制)
 *                注意:tomcat下性能低
 *                修改两个地方:
 *                    1.修改多个tomcat的server.xml 支持共享
 *                            将引擎标签<Engine></Engine>下的 
 *                                <Cluster className="org.apache.catalina.ha.tcp.SimpleTcpCluster"/>
 *                            注释去掉
 *                    2.修改项目的配置文件web.xml中添加一个节点<distributable />
 *
 *        解决方式2:
 *            可以将session的id放入redis中
 *
 *        解决方式3:
 *            保证一个ip地址永远的访问一台web服务器,就不存在session共享问题了,尤其在linux
 *            在nginx的配置文件中的upstream节点中添加 ip_hash; 
 *                                    upstream xxx_server{
 *                                            server 127.0.0.1:8090;
 *                                            server 127.0.0.1:8100;
 *                                            ip_hash; 
 *                                    } 
 *
 * 
 * jmeter进行高并发测试
 * https://blog.csdn.net/u012343297/article/details/81807127
 * https://blog.csdn.net/a656678879/article/details/80053645        //测试报告
 * 
 * 
 */