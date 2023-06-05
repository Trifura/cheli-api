import { SnakeCaseNamingStrategy, LucidModel } from '@ioc:Adonis/Lucid/Orm'
import { string } from '@ioc:Adonis/Core/Helpers'

export class CamelCaseNamingStrategy extends SnakeCaseNamingStrategy {
  public serializedName(_model: LucidModel, propertyName: string) {
    return string.camelCase(propertyName)
  }
}
